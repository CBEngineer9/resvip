const { Router } = require("express");
const AddressesController = require("../controllers/AddressesController");

const addressesRouter = Router();

addressesRouter.get('/',AddressesController.getValidAddresses)