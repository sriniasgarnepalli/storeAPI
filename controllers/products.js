const Product = require('../models/product');

// select functionallity
const getAllProductsStatic = async(req, res) => {
    // throw new Error('static error')
    // const search = 'a'
    // const products = await Product.find({
    //     name: {
    //         $regex: search,
    //         $options: 'abc'
    //     }
    // });
    const {
        company,
        name,
        select
    } = req.query
    const queryObj = {}
    let result = Product.find(queryObj)
    if (select) {
        const selectList = select.split(',').join(' ')
        result = result.select(selectList)
    }
    products = await result
    res.status(200).json({
        products
    });
}

// sort functionality
const getAllProducts = async(req, res) => {
    const {
        featured,
        company,
        name,
        sort,
        fields,
        numericFilters
    } = req.query;
    const queryObj = {}
    if (featured) {
        queryObj.featured = featured === 'true' ? true : false;
    }
    if (company) {
        queryObj.company = {
            $regex: company,
            $options: 'i'
        }
    }
    if (name) {
        queryObj.name = {
            $regex: name,
            $options: 'i'
        }
    }
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '<': '$lt',
            '>=': '$gte',
            '<=': '$lte'
        }
        const regEx = /^(\d+)([><=]+)(\d+)$/
            // regex = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObj[field] = {
                    [operator]: Number(value)
                }
            }
        })
    }
    let result = Product.find(queryObj)
    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
        console.log(sort)
    } else {
        result = result.sort('createdAt')
    }

    if (fields) {
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit)
    const products = await result
    res.status(200).json({
        products
    })
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}