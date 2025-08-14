exports.register = async(req,res)=>{
    //code
    try{
        //code
        const {email, password} = req.body

        //Validate body
        if(!email){
            return res.status(400).json({message : 'Email is require!!!'})
        }
        if(!password){
            return res.status(400).json({message : 'password is require!!!'})
        }

        //Check Email in DB already?

    }catch(err){

        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.login = async(req,res)=>{
    //code
    try{
        res.send('hello login in controller')

    }catch(err){

        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.CurrentUser = async(req,res)=>{
    try{
        res.send('Hello CurrentUser')

    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error" })

    }
}
