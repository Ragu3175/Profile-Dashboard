import bcrypt from 'bcryptjs';
import User from '../schemas/User.js';

/**
 * Return the logged-in user's profile
 * GET /api/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          bio: user.bio || '',
          avatar: user.avatar || '',
          headline: user.headline || '',
          skills: user.skills || [],
          education: user.education || [],
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update the logged-in user's profile
 * PUT /api/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, bio, avatar, headline, skills, education, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User profile not found',
      });
    }

    // Handle email update and uniqueness verification
    if (email !== undefined) {
      if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({
          status: 'fail',
          message: 'Email cannot be empty',
        });
      }
      const normalizedEmail = email.toLowerCase().trim();
      if (normalizedEmail !== user.email) {
        const emailExists = await User.findOne({ email: normalizedEmail });
        if (emailExists) {
          return res.status(400).json({
            status: 'fail',
            message: 'An account with this email already exists',
          });
        }
        user.email = normalizedEmail;
      }
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50) {
        return res.status(400).json({
          status: 'fail',
          message: 'Name must be between 2 and 50 characters',
        });
      }
      user.name = name.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== 'string') {
        return res.status(400).json({
          status: 'fail',
          message: 'Phone must be a string',
        });
      }
      user.phone = phone.trim();
    }

    if (bio !== undefined) {
      if (typeof bio !== 'string') {
        return res.status(400).json({
          status: 'fail',
          message: 'Bio must be a string',
        });
      }
      if (bio.trim().length > 250) {
        return res.status(400).json({
          status: 'fail',
          message: 'Bio cannot exceed 250 characters',
        });
      }
      user.bio = bio.trim();
    }

    if (avatar !== undefined) {
      if (typeof avatar !== 'string') {
        return res.status(400).json({
          status: 'fail',
          message: 'Avatar must be a string',
        });
      }
      user.avatar = avatar.trim();
    }

    // Handle headline update
    if (headline !== undefined) {
      if (typeof headline !== 'string') {
        return res.status(400).json({
          status: 'fail',
          message: 'Headline must be a string',
        });
      }
      user.headline = headline.trim();
    }

    // Handle skills update
    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({
          status: 'fail',
          message: 'Skills must be an array of objects',
        });
      }

      for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        if (!skill || typeof skill !== 'object' || Array.isArray(skill)) {
          return res.status(400).json({
            status: 'fail',
            message: `Skill at index ${i} must be an object`,
          });
        }

        if (typeof skill.name !== 'string' || !skill.name.trim()) {
          return res.status(400).json({
            status: 'fail',
            message: `Skill at index ${i} must have a valid non-empty name`,
          });
        }

        const proficiency = Number(skill.proficiency);
        if (
          skill.proficiency === undefined ||
          skill.proficiency === null ||
          skill.proficiency === '' ||
          typeof skill.proficiency === 'boolean' ||
          !Number.isInteger(proficiency) ||
          proficiency < 0 ||
          proficiency > 100
        ) {
          return res.status(400).json({
            status: 'fail',
            message: `Skill '${skill.name.trim()}' proficiency must be an integer between 0 and 100`,
          });
        }
      }

      user.skills = skills.map((s) => ({
        name: s.name.trim(),
        proficiency: Number(s.proficiency),
      }));
    }

    // Handle education update
    if (education !== undefined) {
      if (!Array.isArray(education)) {
        return res.status(400).json({
          status: 'fail',
          message: 'Education must be an array of objects',
        });
      }

      for (let i = 0; i < education.length; i++) {
        const edu = education[i];
        if (!edu || typeof edu !== 'object' || Array.isArray(edu)) {
          return res.status(400).json({
            status: 'fail',
            message: `Education entry at index ${i} must be an object`,
          });
        }

        if (typeof edu.degree !== 'string' || !edu.degree.trim()) {
          return res.status(400).json({
            status: 'fail',
            message: `Education entry at index ${i} must have a valid degree`,
          });
        }

        if (typeof edu.institution !== 'string' || !edu.institution.trim()) {
          return res.status(400).json({
            status: 'fail',
            message: `Education entry at index ${i} must have a valid institution`,
          });
        }

        const startYear = Number(edu.startYear);
        if (
          edu.startYear === undefined ||
          edu.startYear === null ||
          edu.startYear === '' ||
          typeof edu.startYear === 'boolean' ||
          !Number.isInteger(startYear) ||
          startYear < 1900 ||
          startYear > 2100
        ) {
          return res.status(400).json({
            status: 'fail',
            message: `Education entry at index ${i} startYear must be a valid 4-digit year (between 1900 and 2100)`,
          });
        }

        if (
          edu.endYear !== undefined &&
          edu.endYear !== null &&
          edu.endYear !== ''
        ) {
          const endYear = Number(edu.endYear);
          if (
            typeof edu.endYear === 'boolean' ||
            !Number.isInteger(endYear) ||
            endYear < 1900 ||
            endYear > 2100
          ) {
            return res.status(400).json({
              status: 'fail',
              message: `Education entry at index ${i} endYear must be a valid 4-digit year or null/empty for ongoing education`,
            });
          }

          if (endYear < startYear) {
            return res.status(400).json({
              status: 'fail',
              message: `Education entry at index ${i} endYear cannot be earlier than startYear`,
            });
          }
        }
      }

      user.education = education.map((edu) => ({
        degree: edu.degree.trim(),
        institution: edu.institution.trim(),
        startYear: Number(edu.startYear),
        endYear:
          edu.endYear !== undefined && edu.endYear !== null && edu.endYear !== ''
            ? Number(edu.endYear)
            : null,
      }));
    }

    // Handle password update with hashing
    if (password) {
      if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({
          status: 'fail',
          message: 'Password must be at least 6 characters long',
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          bio: user.bio || '',
          avatar: user.avatar || '',
          headline: user.headline || '',
          skills: user.skills || [],
          education: user.education || [],
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete the logged-in user's account
 * DELETE /api/profile
 */
export const deleteProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User profile not found',
      });
    }

    // Clear the authentication cookie upon account deletion
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({
      status: 'success',
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
