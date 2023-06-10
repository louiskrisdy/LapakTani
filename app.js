const express = require('express');
var http = require('http');
const app = express();
var server = http.createServer(app);
const mysql = require('mysql');
const port = process.env.PORT || 3000; 
const session = require('express-session');
const bcrypt = require('bcrypt'); //hashing passwords for security
require('dotenv').config()
var io = require('socket.io')(server);


app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
// app.use(express.static(__dirname + '/public'));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,	
  database: process.env.DB_DATABASE
});

if (connection.state === 'connected') {
  console.log('MySQL connection is already established.');
} else {
  console.log(connection.state);
  console.log('MySQL connection is not established.');
}

if (connection.state === 'disconnected') {
  connection.connect(function(error) {
    if (error) {
      console.error('Error connecting to MySQL:', error);
    } else {
      console.log(connection.state);
      console.log('Connected to MySQL successfully.');
    }
  });
}

// const config = {
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_DATABASE,
//   options: {
//     encrypt: true // For secure connections
//   }
// };


// mysql.connect(config)
//   .then(() => {
//     console.log('Connected to the database');
//   })
//   .catch(err => {
//     console.error('Failed to connect to the database:', err);
//   });


app.use(
    session({
      secret: 'my_secret_key',
      resave: false,
      saveUninitialized: false,
    })
  );
  
app.use((req, res, next) => {
  if (req.session.userId === undefined) {
    res.locals.isLoggedIn = false;
  } else {
    res.locals.username = req.session.username;
    res.locals.isLoggedIn = true;
  }
  next();
});

app.use((req, res, next)=>{
  res.locals.message = req.session.message
  delete req.session.message
  next()
});

app.get('/', (req, res) => {
    req.session.category = 'notFiltered';
    res.render('index.ejs');
});

app.get('/products', (req, res) => {
 
  if(!req.session.category) {
    req.session.category = 'notFiltered';
  }
  const category = req.session.category;
  res.locals.category = category;
  // if(req.session.category === 'notFiltered' || req.session.category === 'ALL') {
  //   const query = 'SELECT * FROM products';
  //   const request = new sql.Request();

  //   request.query(query, (error, result) => {
  //     if (error) {
  //       console.error('Error executing query:', error);
  //       return;
  //     }
  //     if(!req.session.cart)
  //     {
  //       req.session.cart = [];
  //     }
  //     // console.log(result);
  //     res.render('products.ejs', { products : result.recordset, cart : req.session.cart });
  
  //   });
  // }
  if(req.session.category === 'notFiltered' || req.session.category === 'ALL') {
    const query = 'SELECT * FROM products';
    connection.query(query, (error, result) => {
      if(!req.session.cart)
      {
        req.session.cart = [];
      }
      // console.log(result);
      res.render('products.ejs', { products : result, cart : req.session.cart });
  
    });
  }
  else{
    // console.log(category);
    // const request = new sql.Request();
    // request.input('category', sql.NVarChar, category);

    // request.query(
    //   'SELECT * FROM products WHERE category = @category', (error, result) => {

    //   if(!req.session.cart)
    //   {
    //     req.session.cart = [];
    //   }
    //   // console.log(result);
    //   res.render('products.ejs', { products : result.recordset, cart : req.session.cart });
  
    // });
    connection.query('SELECT * FROM products WHERE category = ?',
    [category], (error, result) => {

      if(!req.session.cart)
      {
        req.session.cart = [];
      }
      // console.log(result);
      res.render('products.ejs', { products : result, cart : req.session.cart });
  
    });
  }

  req.session.category = 'notFiltered';

});

app.post('/filter_products', (req, res) => {
  req.session.category = req.body.product_category;
  res.redirect('/products');

});

app.get('/checkout', (req, res) => {
  req.session.cart = [];
  res.redirect('/products');
});

app.post('/add_cart', (req, res) => {

	const product_id = req.body.product_id;

	const product_name = req.body.product_name;

	const product_price = req.body.product_price;

	let count = 0;

	for(let i = 0; i < req.session.cart.length; i++)
	{

		if(req.session.cart[i].product_id === product_id)
		{
			req.session.cart[i].quantity += 1;

			count++;
		}

	}

	if(count === 0)
	{
		const cart_data = {
			product_id : product_id,
			product_name : product_name,
			product_price : parseFloat(product_price),
			quantity : 1
		};

		req.session.cart.push(cart_data);
	}

	res.redirect("/products");

});

// app.post('/order', (req, res) => {

// 	const product_id = req.body.product_id;

// 	const product_name = req.body.product_name;

// 	const product_price = req.body.product_price;

//   connection.query(
//     'INSERT INTO order_details (..., ..., ...) VALUES (?, ?, ?)',
//     [..., ..., ...],
//     (error, results) => {
//       req.session.userId = results.insertId;
//       req.session.username = username;
//       res.redirect('/');
//     }
//   );
  
// 	let count = 0;

// 	for(let i = 0; i < req.session.cart.length; i++)
// 	{

// 		if(req.session.cart[i].product_id === product_id)
// 		{
// 			req.session.cart[i].quantity += 1;

// 			count++;
// 		}

// 	}

// 	if(count === 0)
// 	{
// 		const cart_data = {
// 			product_id : product_id,
// 			product_name : product_name,
// 			product_price : parseFloat(product_price),
// 			quantity : 1
// 		};

// 		req.session.cart.push(cart_data);
// 	}

// 	res.redirect("/products");

// });

app.get('/remove_item', (req, res) => {

	const product_id = req.query.id;

	for(let i = 0; i < req.session.cart.length; i++)
	{
		if(req.session.cart[i].product_id === product_id)
		{
			req.session.cart.splice(i, 1);
		}
	}

	res.redirect("/products");

});

app.get('/aboutUs', (req, res) => {
  res.render('aboutUs.ejs');
});
  
app.post('/signup', 
  (req, res, next) => {
    console.log('Checking empty input value');
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const errors = [];

    if (username === '') {
      errors.push('Empty username');
    }

    if (email === '') {
      errors.push('Empty email');
    }

    if (password === '') {
      errors.push('Empty password');
    }

    if (errors.length > 0) {
      res.render('login.ejs', { errors: errors });
    } else {
      next();
    }
  },
  (req, res, next) => {
    console.log('Checking duplicate email');
    const email = req.body.email;
    const errors = [];
    // const request = new sql.Request();
    // request.input('email', sql.NVarChar, email);
    // request.query(
    //   `SELECT * FROM user_data WHERE email = @email`,
    //     (error, results) => {
    //       if (results.recordset.length > 0) {
    //         errors.push('Failed to register user');
    //         res.render('login.ejs', { errors: errors });
    //       } else {
    //         next();
    //       }
    //     }
    //   );    
    connection.query(
      'SELECT * FROM user_data WHERE email = ?',
      [email],
      (error, results) => {
        if (results.length > 0) {
          errors.push('Failed to register user');
          res.render('login.ejs', { errors: errors });
        } else {
          next();
        }
      }
    );
  },
  (req, res) => {
    console.log('Register');
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 10, (error, hash) => {
      // const request = new sql.Request();
      // request.input('username', sql.NVarChar, username);
      // request.input('email', sql.NVarChar, email);
      // request.input('password', sql.NVarChar, hash);
      // request.query(
      //   `INSERT INTO user_data (username, email, password)
      //   OUTPUT INSERTED.id
      //   VALUES (@username, @email, @password)`,     
      //   (error, results) => {
      //     // console.log(results);
      //     req.session.userId = results.recordset[0].id;
      //     req.session.username = username;
      //     res.redirect('/');
      //   }
      // );
      connection.query(
        'INSERT INTO user_data (username, email, password) VALUES (?, ?, ?)',
        [username, email, hash],
        (error, results) => {
          req.session.userId = results.insertId;
          req.session.username = username;
          res.redirect('/');
        }
      );
    });
  }
);

app.get('/login', (req, res) => {
    res.render('login.ejs');
});
  
app.post('/login', (req, res) => {
    const email = req.body.email;
    // const request = new sql.Request();
    // request.input('email', sql.NVarChar, email);
    connection.query(
      'SELECT * FROM user_data WHERE email = ?',
      [email],
      (error, results) => {
        if (results.length > 0) {
          const plain = req.body.password;
          const hash = results[0].password;
        
          bcrypt.compare(plain, hash, (error, isEqual) => {
            if ( isEqual ) {
              req.session.userId = results[0].id;
              req.session.username = results[0].username;
              console.log("logged in successfully");
              res.redirect('/');
            } else {
              req.session.message = {
                type: 'danger',
                intro: 'Incorrect email/password! ',
                message: 'Please make sure to insert the correct email and/or password.'
              }
              res.redirect('/login');
            }
          })
  
        } else {
          res.redirect('/login');
        }
      }
    );
});
  
app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
      res.redirect('/');
    });
});

var name;
io.on('connection', (socket) => {
  console.log("New user connected");

  socket.on('joining msg', (username) => {
    name = username;
    io.emit('chat message', `---${name} joined the chat---`);

  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('chat message', `---${name} left the chat---`);
    
  });
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);         //sending message to all except the sender
  });
});

app.post("/get_idChat", (req, res) => {
  req.session.idChat = Math.floor(Math.random() * (100000000 - 1 + 1)) + 1;
  res.redirect('chat.ejs');
})

app.get("/chat", (req, res) => {
  console.log(req.session.idChat);
  if(!req.session.idChat) {
    res.render('404.ejs');
  }
  else {
    res.render('chat.ejs');
  }
});

server.listen(port, () => {
  console.log('Server listening on :3000');
});
// app.listen(port);
