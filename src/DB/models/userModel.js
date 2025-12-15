import { Schema, Types, model } from "mongoose"
import CryptoJS from 'crypto-js'
import { hashSync } from "bcrypt"

export const Gender = {
  male: "male",
  female: "female"
}
Object.freeze(Gender)//Prevents the modification

export const Roles = {
  admin: "admin",
  user: "user"
}
Object.freeze(Roles)

export const Providers = {
  google: "google",
  system: "system"
}
Object.freeze(Providers)

const otpSchema = new Schema({
  otp: String,
  expiredAt: Date
 }, {
  _id: false
})

const userSchema = new Schema({

    name: { type: String, required: true },

    email: { type: String, required: true, unique: true , match:/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },

    password: {
       type: String,
       required:function (params) {
          if (this.provider==Providers.google) {
            return false;
       } else if(this.provider==Providers.system){
           return true;
        }
       },
         minLength:8,
          set(value){
         return hashSync(value,Number(process.env.BCRYPT_SALT_ROUNDS))
       }
        },

    phone: { 
       type: String,
       required:function (params) {
          if (this.provider==Providers.google) {
            return false
       } else if(this.provider==Providers.system){
           return true
        }
       }, 
       minLength:11,

       set(value){
        if(value){
         return  CryptoJS.AES.encrypt(value,process.env.SECRET_KEY).toString()
        }
        return value
       },
       get(value){
        return CryptoJS.AES.decrypt(value,process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8)
        }
        },

    age: { type: Number, min: 20, max: 90 },

    gender: {
      type: String,
      enum: Object.values(Gender),
      default:Gender.male,
    },

    role: { 
      type: String,
      enum:Object.values(Roles), 
      default: Roles.user
     },

    confirmed: {
       type: Boolean,
       default: false
   },

  emailOtp: otpSchema,
  newEmailOtp: otpSchema,
  oldEmailOtp: otpSchema,
  passwordOtp: otpSchema,

  newEmail:String,
  
  changedCredentialsAt:{ type: Date },

  provider: {
  type: String,
  enum: Object.values(Providers),
  default: "system"
},
  
socialId: String,

isDeleted: {
  type: Boolean,
  default: false
},

deletedBy: {
    type: Types.ObjectId,
    ref:'user'
  },
 profileImage: { 
  secure_url: String,
  public_id: String
  },
  coverImage: [{
  secure_url: String,
  public_id: String
   }]

},
  {
    timestamps: true,
    versionKey:false,
    toJSON: { getters: true },
    toObject: { getters: true },
    virtuals:{
      fullName:{
        get(){
          return this.name + "elewa"
        }
      }
    },
    methods:{
      userNmae(){
        if(this.name=="hajar")
          return true
        else
          return false
      },

    }
  }
)
const userModel = model("User", userSchema)
export default userModel