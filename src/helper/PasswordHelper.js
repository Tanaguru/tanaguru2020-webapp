const PasswordHelper = {
    checkValidPassword(pswd) {
        let result = false;
        const pswdRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,;:_]).{8,}$/;

        if(pswdRegex.test(pswd)){
            result = true
        } else { 
            result = false
        }
        
        return result;
    },
}

export default PasswordHelper;