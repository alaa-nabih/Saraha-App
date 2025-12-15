export const create = async (Model, data = {}) => {
  return await Model.create(data) 
}

export const find = async (Model, query = {}) => {
  return await Model.find(query)
}

export const findOne = async (Model, query ) => {
  return await Model.findOne(query)
}

export const findById = async (Model, id) => {
  return await Model.findById(id)
}

export const findByEmail = async (Model,email) => {
  return await Model.findOne({email})
}

export const update = async (Model, query = {}, data = {}) => {
  return await Model.updateOne(query, data)
}

export const remove = async (Model, query = {}) => {
  return await Model.deleteOne(query)
}

export const removeById = async (Model, id) => {
  return await Model.findByIdAndDelete(id)
}

export const findByIdAndUpdate = async (Model, id , data = {} , options= { new: true }) => {
  return await Model.findByIdAndUpdate(id, data, options)
}

export const findOneAndUpdate = async (Model, query = {} , data = {} , options= { new: true }) => {
  return await Model.findOneAndUpdate(query, data, options)
}

export const findByIdAndDelete = async (Model, id) => {
  return await Model.findByIdAndDelete(id)
}

export const findOneAndDelete = async (Model, query = {}) => {
  return await Model.findOneAndDelete(query)
}