const handleRegister = (db, bcrypt) => (req, res) => {
   
   const { name, email, password } = req.body;
   
   if (!email || !name || !password){
     return res.status(400).json('incorrect from submission');
   }
   
   const hash = bcrypt.hashSync(password, 10);
   db.transaction(trx => {
      trx.insert({
         hash: hash,
         email: email
      })
         .into('register')
         .returning('email')
         .then(loginEmail => {
            return trx('users')
               .returning('*')
               .insert({
                  name: name,
                  email: loginEmail[0].email,
                  joined: new Date()
               })
               .then(user => {
                  res.json(user[0]);
               })
         })
         .then(trx.commit)
         .catch(trx.rollback)
   })
      .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
   handleRegister
}; 

