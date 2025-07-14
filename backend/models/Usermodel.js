import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'user'],
        default: 'user'
    },
    phone: { type: String },
    address: { type: String },
    profileImage: { type: String },
    profilePicture: { type: String },
    resetToken: { type: String },
    resetTokenExpire: { type: Date }
}, {
    timestamps: true
});

// Store the original role before changes
UserSchema.pre('save', function(next) {
    if (this.isModified('role')) {
        this._oldRole = this.role;
    }
    next();
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
    try {
        // Handle password hashing
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Separate hook for role changes to ensure it runs after password hashing
UserSchema.post('save', async function() {
    try {
        // Role change logic removed for electronics website
    } catch (error) {
        console.error('Error in post-save hook:', error);
    }
});

// Pre-remove hook to delete related data when a user is deleted
UserSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        const userId = this._id;
        
        // Delete related appointments
        await mongoose.model('Appointment').deleteMany({ userId });
        
        // Delete related notifications if they exist
        try {
            await mongoose.model('Notification').deleteMany({ recipientId: userId });
        } catch (err) {
            console.log('Skipping notification deletion:', err.message);
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Check if model already exists to prevent overwrite error
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
