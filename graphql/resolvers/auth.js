const bcrypt = require('bcryptjs'); // Pack para fazer a encriptação das passwords MD5
const User = require('../../models/user'); // Importação do modelo do User
const jwt = require('jsonwebtoken'); // Gerar token

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
    },
    // depois do async eu posso usar o args ou usar o objecto - vai dar ao mesmo
    login: async ({ email, password }) => {
        // query para verificar se o utilizador existe
        const user = await User.findOne({email: email});
        if (!user) {
          throw new Error('User does not exist!');
        }
        // 1º arg password do cliente 2º argumento password da base de dados
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
          throw new Error('Password is incorrect!');
        }
        // Criação do TOKEN
        const token = jwt.sign(
          { userId: user.id, email: user.email }, 
          'somesupersecretkey', 
          /*{
          expiresIn = '1h'
          }*/
        );
        return { userId: user.id, token: token, tokenExpiration: 1 }
    } 
};