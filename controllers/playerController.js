const Player = require('../models/Player');

exports.createPlayer = async (req, res) => {
    try {
        const player = await Player.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Player created Successfully',
            data: player
        });
    } catch (error) {

        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                error: messages
            });
        }

        if(error.code === 11000){
            const field = Object.keys(error.keyPattern)[0];

            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        })
    }
}

exports.login = async(req, res) => {
    try{
        const {username, password} = req.body;
        if(!username || !password) {
            return res.status(404).json({
                success: false,
                message: "Please provide a valid username and password."
            })
        }
        const player = await Player.findOne({username});
        if(!player || player.password !== password)
            {
                return res.status(404).json({
                    success: false,
                    message: "Invalid Username or password."
                });
            }

            res.status(200).json({
                success: true,
                message: "Login Successful!",
                data: player
            })
    }
    catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
exports.updateScore = async (req, res)=> {
    try{
        const {kills, deaths} = req.body;
        const id = req.params.id; ///player/:id
        const player = await Player.findById(id);

        if(!player)
            {
                return res.status(404).json({
            success: false,
            message: 'Player Not Found'
            });
        }

        player.deaths = player.deaths + deaths;
        player.kills = player.kills + kills;

        await player.save();

        res.status(200).json({
            success: true,
            data: player
        })
    }

    catch(error){
        res.status(500).json({
            success: false,
            message: 'Filed to Update Player KD',
            error: error.message
        });
    }
}   