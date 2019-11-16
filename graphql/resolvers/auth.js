const bcrypt = require('bcryptjs'); // Pack para fazer a encriptação das passwords MD5
const User = require('../../models/user'); // Importação do modelo do User

module.exports = {
    createUser: async args => {
      // verificar se já existe algum user com o email
      // a função findOne faz o filto pelo argumento email para comparar na BD dos users
      try{
        const existingUser = await User.findOne({email: args.userInput.email})
        if (existingUser) {
          throw new Error('User exists already.');
        }
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12); // faz a encriptação da pass e o nível é o 12 (safe)
        // retornar dados do utilizar (incluindo a pwd encriptada) quando criado o user para a BD    
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });
        const result = await user.save();
          return { 
            ...result._doc, 
            password: null,  
            _id: result._doc_id 
          };
      } catch (err) {
        throw err;
      }
    }
};