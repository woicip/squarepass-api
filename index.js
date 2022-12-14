require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use('/static', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// UUID
const { v4: uuidv4 } = require('uuid');

// Multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/avatars/');
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


// chalk module
const chalk = require('chalk');

// My Module
const started = require('./functions/started');
const Response = require('./functions/Response');
const generateID = require('./functions/generateID');

// md5 module
const md5 = require('md5');

// base64 module
const base64 = require('base-64');
const utf8 = require('utf8');

function encryptBase64(string){
    const bytes = utf8.encode(string);
    const encoded = base64.encode(bytes);
    return encoded;
}

function decryptBase64(string){
    const bytes = base64.decode(string);
    const text = utf8.decode(bytes);
    return text;
}

// jsobwebtoken module
const { SECRET_KEY } = require('./apiconfig.json');
const jwt = require('jsonwebtoken');

function CreateToken(user_id, email_address, full_name, avatar, callback){
    jwt.sign({ user_id, email_address, full_name, avatar }, SECRET_KEY, { algorithm: "HS512", expiresIn: '1h' }, (err, token) => {
        if(err) {
            return callback({ success: false, message: "Failed to Create Token" });
        }

        callback({ success: true, message: "Success Created Token", token });
    });
}

function VerifyToken(token, callback){
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if(err) return callback({ success: false, message: "Invalid Token" });
        callback({ success: true, message: "Token Valid", decoded });
    });
}

// mongoose module
const mongoose = require('mongoose');
const { PHRASE } = require('./mongoconfig.json');

mongoose.connect(`mongodb+srv://dbUser:${PHRASE}@koken-cluster.epwup.mongodb.net/squarepass?retryWrites=true&w=majority`);

mongoose.connection.on('connected', err => {
    if(err) return console.log("Error connecting to MongoDB Atlas");
    console.log(`${chalk.green('Connected')} to MongoDB Atlas`);
});

mongoose.connection.on('disconnected', err => {
    if(err) return console.log("Error on Disconnected Event");
    console.log(`${chalk.red('Diconnected')} from MongoDB Atlas`);
});

const platformsSchema = new mongoose.Schema({
    name: String,
    icon: String, 
    thumbnail: String
});

const userSchema = new mongoose.Schema({
    user_id: String,
    full_name: String,
    avatar: String,
    email_address: String,
    password: String,
    security_question: Array,
    secrets: Array
});

const removedUserSchema = new mongoose.Schema({
    user_id: String,
    full_name: String,
    avatar: String,
    email_address: String,
    password: String,
    security_question: Array,
    secrets: Array,
    delete_reason: String
});

const Platforms = mongoose.model('platforms', platformsSchema);
const Users = mongoose.model('users', userSchema);
const RemovedUsers = mongoose.model('removedusers', removedUserSchema);

function createNewUser({ full_name, email_address, password, security_question }, callback){
    const user_id = uuidv4();
    const md5Password = md5(password);
    const createAvatar = () => {
        const firstLetter = full_name.slice(0, 1).toUpperCase();
        return `http://${process.env.HOST}/static/alphabets/${firstLetter}.png`;
    }

    Users.create({ user_id, full_name, avatar: createAvatar(),  email_address, password: md5Password, security_question, secrets: [] }, function (err, doc){
        if(err) throw err;
        callback();
    });
};

async function updateEmail({ user_id, new_email_address }, callback){

    const filter = { user_id: user_id };
    const update = { email_address: new_email_address };

    Users.updateOne(filter, update, async (err, result) => {
        if(err){
            return callback({ success: false, message: "failed_update_email_address" });
        }

        const doc = await Users.findOne({ user_id });

        jwt.sign({
            user_id,
            email_address: doc.email_address,
            full_name: doc.full_name,
            avatar: doc.avatar
        }, SECRET_KEY, { algorithm: 'HS512', expiresIn: '1h' }, (err, token) => {
            if(err) {
                return callback({ success: false, message: "Failed to Create Token" });
            }
            callback({ success: true, token });
        });
    });
}

async function updatePassword({ user_id, new_password }, callback){
    const filter = { user_id: user_id };

    Users.updateOne(filter, { password: new_password }, (err, result) => {
        if(err) return handleError(err);
        callback(result);
    });
}

async function updateFullname({ user_id, new_full_name }, callback){
    const filter = { user_id: user_id };

    Users.updateOne(filter, { full_name: new_full_name }, async (err, result) => {
        if(err) {
            return callback({ success: false, message: "Failed Update Profile" });
        }

        const doc = await Users.findOne({ user_id });

        jwt.sign({
            user_id,
            email_address: doc.email_address,
            full_name: doc.full_name,
            avatar: doc.avatar
        }, SECRET_KEY, { algorithm: 'HS512', expiresIn: '1h' }, (err, token) => {
            if(err) {
                return callback({ success: false, message: "Failed to Create Token" });
            }
            callback({ success: true, token });
        });
    });
}

async function updateAvatar({ user_id, new_avatar }, callback){
    const filter = { user_id: user_id };

    Users.updateOne(filter, { avatar: new_avatar }, async (err, result) => {
        if(err) {
            return callback({ success: false, message: "Failed Update Profile" });
        }

        const doc = await Users.findOne({ user_id });

        jwt.sign({
            user_id,
            email_address: doc.email_address,
            full_name: doc.full_name,
            avatar: doc.avatar
        }, SECRET_KEY, { algorithm: 'HS512', expiresIn: '1h' }, (err, token) => {
            if(err) {
                return callback({ success: false, message: "Failed to Create Token" });
            }
            callback({ success: true, token });
        });
    })
}

async function updateProfile({ user_id, new_full_name, new_avatar }, callback){
    const filter = { user_id: user_id };

    Users.updateOne(filter, { full_name: new_full_name, avatar: new_avatar }, async (err, result) => {
        if(err) {
            return callback({ success: false, message: "Failed Update Profile" });
        }
        
        const doc = await Users.findOne({ user_id });

        jwt.sign({
            user_id,
            email_address: doc.email_address,
            full_name: doc.full_name,
            avatar: doc.avatar
        }, SECRET_KEY, { algorithm: 'HS512', expiresIn: '1h' }, (err, token) => {
            if(err) {
                return callback({ success: false, message: "Failed to Create Token" });
            }
            callback({ success: true, token });
        });
    });
}

async function deleteAccount({ user_id }, callback){
    Users.deleteOne({ user_id }, (err, result) => {
        if(err) return callback({ success: false });
        callback({ success: true, message: "Success Deleted User!" });
    });
}

async function addRemovedUser(data, callback){
    RemovedUsers.create(data, (err, doc) => {
        if(err) return callback({ success: false });
        callback({ success: true, message: "Success add user to removedusers" });
    });
}

// Platforms Data Endpoints

app.get('/getPlatforms', async (req, res) => {
    const Res = new Response(res);

    const doc = await Platforms.find({});
    Res.Success({ platforms: doc });
});

app.post('/postPlatforms', async (req, res) => {
    const Res = new Response(res);

    const { data } = req.body;
    if(data === undefined) return Res.BadRequest({ message: "wrong_data" });

    const size = Object.keys(data).length;
    if(size < 1) return Res.BadRequest({ message: "wrong_data" });

    Platforms.insertMany(data.platforms, (err, result) => {
        if(err) Res.InternalServerErrror({ message: "Something wrong when insert document" });
        console.log(result);
        Res.Success({ message: "POST OK" });
    })
});

// Users Data Endpoints

app.get('/', (req, res) => {
    new Response(res).Success({ message: "Welcome to SquarePass API" });
});

app.post('/login', async (req, res) => {

    const Res = new Response(res);

    const { data } = req.body;
    if(data === undefined) return Res.BadRequest({ message: "wrong_data" });

    const size = Object.keys(data).length;
    if(size < 1) return Res.BadRequest();

    const { email_address, password } = data;
    if(!email_address.length || !password.length) return Res.BadRequest({ message: "wrong_data" });

    const md5Password = md5(password);
    const doc = await Users.findOne({ email_address, password: md5Password });

    if(doc === null){
        Res.NotFound({ message: "user_not_found" });

    } else {
        CreateToken(doc.user_id, doc.email_address, doc.full_name, doc.avatar, (result) => {
            if(result.success){
                Res.Success({
                    message: "success_authorized",
                    token: result.token,
                });

            } else {
                Res.InternalServerErrror({ message: "something_wrong_with_token" });
            }
        });
    }
});

app.post('/register', (req, res) => {

    const Res = new Response(res);

    const { data } = req.body;
    if(data === undefined) return Res.BadRequest({ message: "wrong_data" });

    const size = Object.keys(data).length;
    if(size < 1) return Res.BadRequest({ message: "wrong_data" });

    const { full_name, email_address, password, security_question } = data;
    if(!full_name.length || !email_address.length || !password.length || !security_question.length) return Res.BadRequest({ message: "wrong_data" });
    if(security_question.length < 3) return Res.BadRequest({ message: "wrong_data" });

    createNewUser({ full_name, email_address, password, security_question }, () => Res.Success({ message: "Success Created New User" }));
});

app.post('/create', (req, res) => {
    const Res = new Response(res);

    if(req.get('Authorization') === undefined) return Res.Unauthorized();

    const HeaderToken = req.get('Authorization').split(' ')[1];

    const { data } = req.body;
    if(data === undefined) return Res.BadRequest({ message: "wrong_data" });

    const size = Object.keys(data).length;
    if(size < 1) return Res.BadRequest({ message: "wrong_data" });

    VerifyToken(HeaderToken, async (result) => {
        if(result.success){
            const { user_id } = result.decoded;
            
            const doc = await Users.findOne({ user_id });
            const secret_id = `se-${generateID()}`;

            const dataset = { 
                secret_id, 
                platform_name: data.platform_name, 
                platform_thumbnail: data.platform_thumbnail, 
                platform_icon: data.platform_icon,
                name: data.name, 
                phrase: encryptBase64(data.phrase), 
                date: new Date() 
            };

            const NewSecrets = [ ...doc.secrets, dataset ];

            Users.updateOne({ user_id }, { secrets: NewSecrets }, (err, result) => {
                if(err) {
                    console.log(err);
                    Res.InternalServerErrror({ message: "Failed while adding secret" });
                } else {
                    Res.Success({ message: "Success adding secrets" });
                }
            });
        } else {
            Res.Unauthorized();
        }
    });
});

app.post('/detail', (req, res) => {
    const Res = new Response(res);

    if(req.get('Authorization') === undefined) return Res.Unauthorized();
    const HeaderToken = req.get('Authorization').split(' ')[1];

    const { data } = req.body;
    if(data === undefined) return Res.BadRequest({ message: "wrong_data" });

    const size = Object.keys(data).length;
    if(size < 1) return Res.BadRequest({ message: "wrong_data" });

    const { xyzsec_id } = data;

    VerifyToken(HeaderToken, async (result) => {
        if(result.success){
            const { user_id } = result.decoded;
            const doc = await Users.findOne({ user_id });
            const detailSecret = doc.secrets.filter(secret => secret.secret_id === xyzsec_id)[0];
            Res.Success({ message: "Success Get Detail", detail: detailSecret });
            
        } else {
            Res.Unauthorized();
        }
    });
})

app.get('/secrets', (req, res) => {

    const Res = new Response(res);

    if(req.get('Authorization') === undefined) return Res.Unauthorized();

    const HeaderToken = req.get('Authorization').split(' ')[1];

    VerifyToken(HeaderToken, async (result) => {
        if(result.success){
            const { user_id } = result.decoded;
            const doc = await Users.findOne({ user_id });

            if(doc === null){
                Res.NotFound({ message: "user_not_found" });
            } else {
                Res.Success({ secrets: doc.secrets });
            }

        } else {
            Res.Unauthorized();
        }
    });
});

app.post('/deleteSecret', (req, res) => {
    const Res = new Response(res);

    if(req.get('Authorization') === undefined) return Res.Unauthorized();
    const HeaderToken = req.get('Authorization').split(' ')[1];

    const { data } = req.body;
    if(data === undefined) return Res.BadRequest({ message: "wrong_data" });

    const size = Object.keys(data).length;
    if(size < 1) return Res.BadRequest({ message: "wrong_data" });

    const { xyzsec_id } = data;

    VerifyToken(HeaderToken, async (result) => {
        if(result.success){
            const { user_id } = result.decoded;
            const doc = await Users.findOne({ user_id });

            if(doc === null){ 
                return Res.NotFound({ message: "USER NOT FOUND" });
            }

            const deletedSecret = doc.secrets.filter(secret => secret.secret_id !== xyzsec_id);

            Users.updateOne({ user_id }, { secrets: deletedSecret }, (err, res) => {
                if(err) {
                    Res.InternalServerErrror({ message: "Failed Delete Secret" });
                } else {
                    Res.Success({ message: "Success Deleted Secret" });
                }
            });

        } else {
            Res.Unauthorized();
        }
    });
});

app.get('/secretsLength', (req, res) => {
    const Res = new Response(res);

    if(req.get('Authorization') === undefined) return Res.Unauthorized();
    const HeaderToken = req.get('Authorization').split(' ')[1];

    VerifyToken(HeaderToken, async (result) => {
        if(result.success){
            const { user_id } = result.decoded;
            const doc = await Users.findOne({ user_id });

            if(doc === null){
                Res.NotFound({ message: "user_not_found" });
            } else {
                Res.Success({ length: doc.secrets.length });
            }

        } else {
            Res.Unauthorized();
        }
    });
})

app.get('/survey', (req, res) => {

    const Res = new Response(res);

    if(req.get('Authorization') === undefined) return Res.Unauthorized();

    const HeaderToken = req.get('Authorization').split(' ')[1];

    VerifyToken(HeaderToken, async (result) => {
        if(result.success){
            const { user_id } = result.decoded;

             Users.findOne({ user_id }, (err, person) => {
                if(err) Res.NotFound({ message: "USER NOT FOUND" });
                else Res.Success({ message: "AUTHORIZED" });
             });
        } else {
            Res.Unauthorized();
        }
    });
})

app.post('/updateProfile', upload.single('new_avatar'), (req, res) => {

    const Res = new Response(res);

    if(req.get('Authorization') === undefined) return Res.Unauthorized();
    const HeaderToken = req.get('Authorization').split(' ')[1];
    
    const bodySize = Object.keys(req.body).length;
    if(!bodySize) Res.BadRequest({ message: "wrong_data" });

    const { new_full_name } = req.body;
    
    VerifyToken(HeaderToken, async (result) => {
        if(result.success){
            const { user_id } = result.decoded;

            if(new_full_name.length && req.file === undefined){
                updateFullname({ user_id, new_full_name }, (updateRes) => {
                    if(updateRes.success) Res.Success({ message: "Success Updated Full Name", token: updateRes.token })
                    else Res.InternalServerErrror(updateRes.message);
                });

            } else if(!new_full_name.length && req.file !== undefined){
                updateAvatar({ user_id, new_avatar: `http://${process.env.HOST}/static/avatars/${req.file.filename}` }, (updateRes) => {
                    if(updateRes.success) Res.Success({ message: "Success Updated Avatar", token: updateRes.token })
                    else Res.InternalServerErrror(updateRes.message);
                });

            } else {
                updateProfile({ user_id, new_full_name, new_avatar: `http://${process.env.HOST}/static/avatars/${req.file.filename}` }, (updateResult) => {
                    if(updateResult.success) Res.Success({ message: "Success Updated Profile", token: updateResult.token });
                    else Res.InternalServerErrror(updateResult.message);
                });
            }


        } else {
            Res.Unauthorized();
        }
    });
});

app.post('/updateEmail', async (req, res) => {

    const Res = new Response(res);

    if(req.get('Authorization') === undefined) return Res.Unauthorized();

    const HeaderToken = req.get('Authorization').split(' ')[1];

    const { data } = req.body;
    if(data === undefined) return Res.BadRequest({ message: "wrong_data" });

    const size = Object.keys(data).length;
    if(size < 1) return Res.BadRequest({ message: "wrong_data" });

    const { new_email_address } = data;
    if(!new_email_address.length) return Res.BadRequest({ message: "wrong_data" });

    VerifyToken(HeaderToken, async (result) => {
        if(result.success){
            const { user_id } = result.decoded;

            updateEmail({ user_id, new_email_address }, (updateResult) => {
                if(updateResult.success) Res.Success({ message: "success_updated_email_address", token: updateResult.token });
                else Res.InternalServerErrror(updateResult.message);
            });

        } else {
            Res.Unauthorized();
        }
    });
    
});

app.get('/updatePassword', async (req, res) => {
    const Res = new Response(res);

    if(req.get('Authorization') === undefined) return Res.Unauthorized();
    const HeaderToken = req.get('Authorization').split(' ')[1];

    VerifyToken(HeaderToken, async (result) => {
        if(result.success){
            const { user_id } = result.decoded;
            const doc = await Users.findOne({ user_id });
            Res.Success({ message: "Success Retrieve Data", phrase: doc.password });
        } else {
            Res.Unauthorized();
        }
    });
});

app.post('/updatePassword', async (req, res) => {

    const Res = new Response(res);

    if(req.get('Authorization') === undefined) return Res.Unauthorized();
    const HeaderToken = req.get('Authorization').split(' ')[1];

    if(req.body.data === undefined) return Res.BadRequest({ message: "wrong_data" });

    const size = Object.keys(req.body.data).length;
    if(size < 1) return Res.BadRequest({ message: "wrong_data" });

    const { new_password } = req.body.data;

    VerifyToken(HeaderToken, async (result) => {
        if(result.success){
            const { user_id } = result.decoded;

            updatePassword({ user_id, new_password }, (result) => {
                Res.Success({ message: "Success Updated Password!" });
            });
        } else {
            Res.Unauthorized();
        }
    });
});

app.post('/deleteAccount', (req, res) => {
    const Res = new Response(res);

    if(req.get('Authorization') === undefined) return Res.Unauthorized();
    const HeaderToken = req.get('Authorization').split(' ')[1];

    if(req.body.data === undefined) return Res.BadRequest({ message: "wrong_data" });

    const size = Object.keys(req.body.data).length;
    if(size < 1) return Res.BadRequest({ message: "wrong_data" });

    const { reason } = req.body.data;

    VerifyToken(HeaderToken, async (result) => {
        if(result.success){
            const { user_id } = result.decoded;
            const doc = await Users.findOne({ user_id });
            const deletedUser = { ...doc._doc, delete_reason: reason };
            
            addRemovedUser(deletedUser, (result) => {
                if(result.success){
                    deleteAccount({ user_id }, (result) => {
                        if(result.success){
                            Res.Success({ message: "Success Deleted User!" });
                            
                        } else {
                            Res.InternalServerErrror({ message: "Failed Delete User" });
                        }
                    });

                } else {
                    console.log("FAILED ADD USER TO REMOVEDUSERS");
                    Res.InternalServerErrror({ message: "Failed Delete User" });
                }
            })

        } else {
            Res.Unauthorized();
        }
    });
});

app.post('/checkEmail', async (req, res) => {

    const Res = new Response(res);

    if(req.body.data === undefined) return Res.BadRequest({ message: "wrong_data" });

    const size = Object.keys(req.body.data).length;
    if(size < 1) return Res.BadRequest({ message: "wrong_data" });

    const { email_address } = req.body.data;

    const doc = await Users.findOne({ email_address });

    if(doc === null) {
        Res.NotFound({ message: "Email Not Found" });

    } else {
        Res.Success({ message: "Email Found" });
    }
});

app.post('/checkPassword', async (req, res) => {

    const Res = new Response(res);

    if(req.get('Authorization') === undefined) return Res.Authorization();
    const HeaderToken = req.get('Authorization').split(' ')[1];

    const { data } = req.body;
    if(data === undefined) return Res.BadRequest({ message: "wrong_data" });

    const size = Object.keys(data).length;
    if(size < 1) return Res.BadRequest({ message: "wrong_data" });

    const { password } = data;
    const md5Password = md5(password);

    VerifyToken(HeaderToken, async (result) => {
        if(result.success){
            const { user_id } = result.decoded;
            const doc = await Users.findOne({ user_id });

            if(doc.password !== md5Password) {
                Res.NotFound({ message: "Wrong Password" });

            } else {
                Res.Success({ message: "Password is Correct" });
            }

        } else {
            Res.Unauthorized();
        }
    });

    
});

app.post('/getSecurityQuestion', async (req, res) => {

    const Res = new Response(res);

    if(req.body.data === undefined) return Res.BadRequest({ message: "wrong_data" });

    const size = Object.keys(req.body.data).length;
    if(size < 0) return Res.BadRequest({ message: "wrong_data" });

    const { email_address } = req.body.data;
    
    const doc = await Users.findOne({ email_address });

    if(doc === null){
        Res.NotFound({ message: "Security Question Not Found" });

    } else {
        Res.Success({ security_question: doc.security_question });
    }

});


app.post('/findUser', async (req, res) => {

    const Res = new Response(res);

    if(req.get('Authorization') === undefined) Res.Unauthorized();

    const HeaderToken = req.get('Authorization').split(' ')[1];

    if(req.body.data === undefined) return Res.BadRequest({ message: "wrong_data" });

    const size = Object.keys(req.body.data).length;
    if(size < 0) return Res.BadRequest({ message: "wrong_data" });

    const { full_name } = req.body.data;

    VerifyToken(HeaderToken, async (result) => {
        if(result.success){
            const doc = await Users.findOne({ full_name });

            if(doc === null){
                Res.NotFound({ message: "User Not Found" });
            } else {
                Res.Success({ user: doc });
            }

        } else {
            Res.Unauthorized();
        }
    });
});


app.listen(process.env.PORT || 3000, () => started({ port: process.env.PORT }));