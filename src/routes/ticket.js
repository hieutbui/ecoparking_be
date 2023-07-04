import express from 'express';
import controllers from '../controllers/index.js';

const tickets = express.Router();

tickets.post('/create-new-ticket', controllers.tickets.createNewTicket);
tickets.get('/get-ticket', controllers.tickets.getTicket);
tickets.post('/delete-ticket', controllers.tickets.deleteTicket);
tickets.patch('/update-ticket', controllers.tickets.updateTicket);

export default tickets;
