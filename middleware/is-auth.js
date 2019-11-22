const jwt = require('jsonwebtoken'); // Pack gerar token

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    // o user pode não ter acesso total aos dados, pode ter acesso só a alguns pontos da app
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; // 2 valor retornados (1º user e 2º token - isto num array) e vai buscar o token
    if (!token || token === '') {
        req.isAuth = false;
        return next();
      }
    let decodedToken;
    // Verifica o token com a Key que temos - Decoded Token
    try {
        decodedToken = jwt.verify(token, 'somesupersecretkey');
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next(); 
    }
    // se chegar aqui é pk o user colocou tudo correto
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}