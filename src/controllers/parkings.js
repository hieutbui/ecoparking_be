import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import Parking from '../models/Parking.js';

/* author: dunglda
description: create a new parking and storage in parking table on DB
*/
const createNewParking = async (req, res) => {
    const { name, address, quantity } = req.body;

    if (!name || typeof name !== 'string' ||
        !address || typeof address !== 'string' ||
        !quantity || typeof quantity !== 'number') {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: 'Invalid parameter types!'
            });
    }

    try {
        const existingParking = await Parking.findOne({address});
        
        if (existingParking) {
            return res.status(HttpStatusCode.CONFLICT).json({
                message: `A parking with address ${address} already exists!`
            });
        }

        const newParking = new Parking({
            name: name,
            address: address,
            quantity: quantity,
        });
        
        await newParking.save();
        
        res.status(HttpStatusCode.OK).json({
            message: "Create a new parking success!"
        });
    } catch (error) {
        //Handle errors while finding or creating a parking record
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: `Failed to create a new parking. Error: ${error.message}`
        });
    }
};

/* author: dunglda
*/
const getParkings = async (req, res) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string')
    {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: 'Invalid parameter types!'
            });
    }

    try {
        const foundParking = await Parking.findById({id});
        
        if (!foundParking) {
            return res.status(HttpStatusCode.CONFLICT).json({
                message: 'No parking space found!'
            });
        }
        
        res.status(HttpStatusCode.OK).json({
            data: foundParking,
            message: 'Get information of parking success!'
        });
    } catch (error) {
        //Handle errors while finding or creating a parking record
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: `Failed to found a parking. Error: ${error.message}`
        });
    }
};

/* author: dunglda
description: update a parking in DB
*/
const updateParkings = async (req, res) => {
    const {id, name, address, quantity } = req.body;

    if (!id || typeof id !== 'string' ||
        !name || typeof name !== 'string' ||
        !address || typeof address !== 'string' ||
        !quantity || typeof quantity !== 'number') {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: 'Invalid parameter types!'
            });
    }

    try {
        const existingParking = await Parking.findById({id});
        
        if (!existingParking) {
            return res.status(HttpStatusCode.CONFLICT).json({
                message: `A parking with ID doesn't exist!`
            });
        }

        const newParking = await existingParking.update({
            name: name,
            address: address,
            quantity: quantity,
        });
                
        res.status(HttpStatusCode.OK).json({
            data: newParking,
            message: "Update the parking success!"
        });
    } catch (error) {
        //Handle errors while finding or creating a parking record
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: `Failed to update a parking. Error: ${error.message}`
        });
    }
};

/* author: dunglda
*/
const deleteParkings = async (req, res) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string')
    {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: 'Invalid parameter types!'
            });
    }

    try {
        const foundParking = await Parking.findById({id});
        
        if (!foundParking) {
            return res.status(HttpStatusCode.CONFLICT).json({
                message: 'No parking space found!'
            });
        }

        await Parking.deleteOne({id: id});
        
        res.status(HttpStatusCode.OK).json({
            data: foundParking,
            message: 'Delete sparking success!'
        });
    } catch (error) {
        //Handle errors while finding or creating a parking record
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: `Failed to delete a parking. Error: ${error.message}`
        });
    }
};

export default { 
  createNewParking,
  getParkings,
  updateParkings,
  deleteParkings
};
 