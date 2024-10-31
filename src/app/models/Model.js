import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true, //! 必须
        },
        password: {
            type: String,
            required: true,
            set: (v) => {
                return bcrypt.hashSync(v, 10);
            }
        },
        telphone: {
            type: String,
            required: false,
        },
        grade: {
            type: String,
            required: false,
        },
        sex: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        name: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        politicalAffiliation: {
            type: String,
            required: false,
        },
        avatar: {
            type: String,
            required: false,
        },
        permission: {
            type: String,
            default: 'student'
        }
    },
);

const noticeSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        creator: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
            default: Date.now,
        },
    }
);

const classSchema = mongoose.Schema(
    {
        teacher: {
            type: String,
            required: true,
        },
        major: {
            type: String,
            required: true,
        },
        studentName: {
            type: String,
            required: true,
        },
        grad: {
            type: Date,
            default: Date.now,
        },
    }
);

const courseSchema = mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'courseInfo',
            required: true,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'courseInfo',
            required: true,
        },
    }
);

const courseInfoSchema = mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    teacher: {
        type: String,
        required: true,
    },
    subjectNo: {
        type: String,
        required: true,
    },
    credits: {
        type: String,
        required: true,
    },
    courseOverview: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    isMandatory: {
        type: String,
        required: true,
    },
    examinationFormat: {
        type: String,
        required: true,
    },
})

const UserModel = mongoose.models?.users || mongoose.model("users", userSchema);

const NoticeModel = mongoose.models?.notices || mongoose.model("notices", noticeSchema);

const ClassModel = mongoose.models?.classes || mongoose.model("classes", classSchema);

const ChooseClassModel = mongoose.models?.courses || mongoose.model("courses", courseSchema);

const CourseInfoModel = mongoose.models?.courseInfo || mongoose.model("courseInfo", courseInfoSchema);

export {
    UserModel,
    NoticeModel,
    ClassModel,
    ChooseClassModel,
    CourseInfoModel,
}
