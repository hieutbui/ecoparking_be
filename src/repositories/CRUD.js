import Exception from '../exceptions/Exception.js';

/* dunglda: create a general function help create new item. keyAttribute is attribute 
that user find an item throught keyAttribute to check exist same item. */
const createNewItem = async (attributes, keyAttribute, Model) => {
  try {
    const query = {};
    query[keyAttribute] = attributes[keyAttribute];
    console.log(attributes)
    console.log(query[keyAttribute]);

    // Check if an existing item of the same keyAttribute already exists
    const existingItem = await Model.findOne(query);

    if (existingItem) {
      throw new Error('Item already exists');
    }

    // Create a new item based on the provided attributes
    const newItem = new Model(attributes);

    await newItem.save();

    return "Create a new parking success!";
  } catch (error) {
    throw new Error('Failed to create item: ' + error.message);
  }
};

// dunglda: the function allow user get one or many item from db
const getItem = (id, Model) => {
  return new Promise(async (resolve, reject) => {
    try {
      let foundItems;
      
      if (typeof id === 'string') {
        foundItems = await Model.findById(id);
      } else if (Array.isArray(id)) {
        foundItems = await Model.find({ _id: { $in: id } });
      } else {
        throw new Error('Invalid value');
      }

      if (!foundItems || foundItems.length === 0) {
        throw new Error('No parking space found!');
      }

      resolve(foundItems);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteItem = async (id, Model) => {
  try {
    // Check if the item exists
    const item = await Model.findById(id);

    if (!item) {
      throw new Error('Item not found');
    }

    // Delete the item
    await Model.findByIdAndDelete(id);

    return "Item deleted successfully!";
  } catch (error) {
    throw new Error('Failed to delete item: ' + error.message);
  }
};

const updateItem = async (id, attributes, Model) => {
  try {
    // Check if the item exists
    const item = await Model.findById(id);

    if (!item) {
      throw new Error('Item not found');
    }

    // Update the item attributes
    Object.assign(item, attributes);
    await item.save();

    return "Item updated successfully!";
  } catch (error) {
    throw new Error('Failed to update item: ' + error.message);
  }
};

export {
  getItem,
  createNewItem,
  deleteItem,
  updateItem,
};