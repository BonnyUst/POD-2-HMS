const mongoose = require('mongoose')
const Counter = require('./Counter.model')

const employeeSchema = new mongoose.Schema(
    {
        employeeCode: {
            type: String,
            unique: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        // name:{
        //     type:String,
        //     required:true,
        //     trim:true
        // },
        phone: {
            type: String,
            required: true
        },
        // email:{
        //     type:String,
        //     required:true,
        //     unique:true,
        //     trim:true,
        //     lowercase:true
        // },
        department: {
            type: String,
            enum: ['OPD', 'IPD', 'Lab', 'Pharmacy', 'Admin']
        },
        designation: {
            type: String,
            enum: ['Jr Doctor', 'Nurse', 'Receptionist']
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE'],
            default: 'ACTIVE'
        },
        joiningDate: {
            type: Date,
            required: true
        },
        medicalRegistrationNo: {
            type: String,
            unique: true,
            sparse: true
        },
        specialization: {
            type: String,
            trim: true
        },
        qualification: [
            { type: String }
        ],
        consultationFee: {
            type: Number
        },
        availabilitySlots: [{

            date: {
                type: Date
            },
            startTime: {
                type: String
            },
            endTime: { type: String },
            isBooked: {
                type: Boolean,
                default: false
            }

        }]
    }
);

employeeSchema.pre('save', async function () {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'employee' },
                { $inc: { seq: 1 } },
                {
                    returnDocument: 'after',
                    upsert: true
                }
            );

            this.employeeCode = `EMP-${String(counter.seq).padStart(6, '0')}`;
        } catch (error) {
            console.error(error);
        }
    }


});

module.exports = mongoose.model("Employee", employeeSchema);

