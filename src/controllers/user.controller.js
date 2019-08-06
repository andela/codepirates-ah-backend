import UserService from '../services/user.service';
import Helper from '../helpers/helper';


class UserController{
    static async login(req, res) {
        try {
          let theUser;

          if(req.body.email){
            theUser = await UserService.findOne(req.body.email,'');
          }else{
            theUser = await UserService.findOne('',req.body.username);
          }

          if (!theUser){
              return res.status(404).send({
                  status:404,
                  message:`Cannot find User with the email or username`
          })}

            const validPassword = await Helper.comparePassword( theUser.password,req.body.password);
            if (!validPassword) {
                return res.status(401).send({
                    status:401,
                    message:'Password is not correct'
                })
            } else {
                const payload ={
                    email: theUser.email,
                    role:theUser.role
                }
              const token = await Helper.generateToken(payload);
              return res.status(200).send({
                  status:200,
                  message:`welcome  back ${theUser.firstname}`,
                  token:token
              })
            }
        } catch (error) {
            return res.status(404).send({
                status:404,
                message:error.message
            })
        }
      }
      static async createAdmin(req, res) {
        const newUser=req.body;
        newUser.email=req.body.email.toLowerCase();
      try {
        const theUser = await UserService.findOne(req.body.email);
        const theUserName = await UserService.findOne(req.body.username);
        if ((theUser) || (theUserName )){
            return res.status(404).send({
                status:404,
                message:`Cannot register admin with the id ${req.body.email} which is already in use`
        })} else {
          const hashPassword= await Helper.hashPassword(req.body.password);
          if (!hashPassword) {
              return res.status(401).send({
                  status:401,
                  message:'occur error while hashing'
              })
          } else {
              req.body.password=hashPassword;
             const createdUser =  await UserService.addUser(newUser);
             const { firstname, lastname, username, email} = createdUser;
             const payload ={
                 email: newUser.email,
                 role:newUser.role,
                 verified:newUser.verified
             }
            const token = await Helper.generateToken(payload);
            return res.status(201).json({
                status:201,
                message:'successfully created account ',
                data: { firstname, lastname, username, email},
                token
            })

          }
        }

      } catch (error) {
          const {errors} = error;
          return res.status(404).send({
              status:404,
              message: errors[0].message
          })
      }
    }
      static async signup(req, res) {

          const newUser=req.body;
          newUser.email=req.body.email.toLowerCase();
          
        try {
          const theUser = await UserService.findOne(req.body.email);
          if (theUser) {
              return res.status(404).send({
                  status:404,
                  message:`Cannot register User with the id ${req.body.email} which is already in use`
          })} else {
            const hashPassword= await Helper.hashPassword(req.body.password);
            if (!hashPassword) {
                return res.status(401).send({
                    status:401,
                    message:'occur error while hashing'
                })
            } else {
                req.body.password=hashPassword;
               const createdUser =  await UserService.addUser(newUser);
               const payload ={
                   email: newUser.email,
                   role:newUser.role,
                   verified:newUser.verified
               }
              const token = await Helper.generateToken(payload);
              return res.status(201).json({
                  status:201,
                  message:'successfully created account ',
                  data:createdUser,
                  token
              })

            }
          }

        } catch (error) {
            return res.status(404).send({
                status:404,
                message:error.message
            })
        }
      }
    static async getAllUsers(req,res){
        try{
            const allUsers=await UserService.getAllUsers();
            if(allUsers){
                return res.status(200).send({
                    status:200,
                    message:'All users successfully retrieved',
                    data:allUsers
                })
            }
            else{
                return res.status(200).send({
                    message:'no users found'
                })
            }
        }
    catch(error){
        return res.status(400).send({
            status: 400,
            message: error.message
          });
    }
}
static async getOneUser(req,res){
    const {id}=req.params;
    if(!Number(id)){
        return res.status(400).send({
            status:400,
            message:'Please input a valid numeric value'
        })
    }
    try{
    const theUser=await UserService.getOneUser(id);
    if(!theUser){
        return res.status(404).send({
            status:404,
            message:`Can not find the user with id ${id}`
        })
    }
    else{
        return res.status(200).send({
            status:200,
            message:`User with id ${id} Found`,
            data:theUser
        })
    }
}
    catch(error){
        return res.send({
            message:error.message
        })

    }

}
static async deleteUser(req,res){
    const {id}=req.params;
    if(!Number(id)){
        return res.status(400).send({
            status:400,
            message:'Please provide numeric value'
        })
    }
    try{
        const UserTODelete=await UserService.deleteUser(id);
        if(UserTODelete){
            return res.status(200).send({
                status:200,
                message:`User with id ${id} is successfully deleted`
            })
        }
        else{
            return res.status(404).send({
                status:404,
                message:`User with id ${id} is not found`
            })
        }
        
    }
    catch(error){
        return res.send({
            message:error.message
        })
    }

}
static async updateUser(req,res){
    const alteredUser=req.body;
    const {email}=req.params;
    if(!email){
        return res.status(400).send({
            status:400,
            message:'Please provide invalid numeric value'

        })
    }
    try {
        const updateUser=await UserService.updateUser(email,alteredUser);
        if(!updateUser){
            return res.status(404).send({
                status:404,
                message: `User with email ${email} is not not found `,
                
            })
        }
        else{
            return res.status(200).send({
                status:200,
                message:`User with email ${email} is updated successfully`,
                data:updateUser
            })
        }
    }
    catch(error){
        return res.status(404).send({
            status:404,
            message:error.message
        })
    }
}
};

export default UserController;