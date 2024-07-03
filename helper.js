const { query, executeSQL } = require('./config');

async function select(tableName, conditions = {}) {
    try {
      let queryStr = `SELECT * FROM ${tableName}`;
      let valuesForWhereClause = [];
      let sortOrder = 'ASC';
      let orderBy = 'id'; // Default to ordering by 'id'
      let limit = 1000; // Default limit
  
      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions)
          .filter(key => key !== 'sort' && key !== 'orderBy' && key !== 'limit') // Exclude 'sort', 'orderBy', and 'limit' from where clause
          .map(key => `${key} = ?`)
          .join(' AND ');
        valuesForWhereClause = Object.values(conditions).filter(value => value !== 'asc' && value !== 'desc' && value !== conditions.orderBy && value !== conditions.limit);
        
        if (whereClause) {
          queryStr += ` WHERE ${whereClause}`;
        }
        
        // Check for sort condition
        if (conditions.sort && (conditions.sort.toLowerCase() === 'asc' || conditions.sort.toLowerCase() === 'desc')) {
          sortOrder = conditions.sort.toUpperCase();
        }
  
        // Check for orderBy condition
        if (conditions.orderBy) {
          orderBy = conditions.orderBy;
        }
  
        // Check for limit condition
        if (conditions.limit) {
            const parsedLimit = parseInt(conditions.limit, 10);
            if (!isNaN(parsedLimit) && parsedLimit > 0) {
              limit = parsedLimit;
            }
        }
      }
  
      // Append ORDER BY clause
      queryStr += ` ORDER BY ${orderBy} ${sortOrder}`;
  
      // Append LIMIT clause
      queryStr += ` LIMIT ${limit}`;
      const rows = await query(queryStr, valuesForWhereClause);
      
      return rows;
    } catch (error) {
      throw new Error(`Error selecting from database: ${error.message}`);
    }
}
  
async function selectWithPagination(tableName, conditions = {}, page = 1, pageSize = 10) {
    try {
      let queryStr = `SELECT * FROM ${tableName}`;
      let valuesForWhereClause = [];
      let sortOrder = 'ASC';
      let orderBy = 'id'; // Default to ordering by 'id'
  
      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions)
          .filter(key => key !== 'sort' && key !== 'orderBy' && key !== 'limit') // Exclude 'sort', 'orderBy', and 'limit' from where clause
          .map(key => `${key} = ?`)
          .join(' AND ');
        valuesForWhereClause = Object.values(conditions).filter(value => value !== 'asc' && value !== 'desc' && value !== conditions.orderBy && value !== conditions.limit);
        
        if (whereClause) {
          queryStr += ` WHERE ${whereClause}`;
        }
        
        // Check for sort condition
        if (conditions.sort && (conditions.sort.toLowerCase() === 'asc' || conditions.sort.toLowerCase() === 'desc')) {
          sortOrder = conditions.sort.toUpperCase();
        }
  
        // Check for orderBy condition
        if (conditions.orderBy) {
          orderBy = conditions.orderBy;
        }
  
        // Check for limit condition and validate it
        if (conditions.limit) {
          const parsedLimit = parseInt(conditions.limit, 10);
          if (!isNaN(parsedLimit) && parsedLimit > 0) {
            pageSize = parsedLimit;
          }
        }
      }
  
      const offset = (page - 1) * pageSize;
      queryStr += ` ORDER BY ${orderBy} ${sortOrder}`; 
      queryStr += ` LIMIT ${pageSize} OFFSET ${offset}`;
  
      const rows = await query(queryStr, valuesForWhereClause);
      
      return rows;
    } catch (error) {
      throw new Error(`Error selecting from database: ${error.message}`);
    }
}

async function count(tableName, conditions = {}) {
    try {
      // Construct the SQL query to count records
      let queryStr = `SELECT COUNT(*) AS count FROM ${tableName}`;
      let valuesForWhereClause = [];
  
      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions)
          .map(key => `${key} = ?`)
          .join(' AND ');
        valuesForWhereClause = Object.values(conditions);
        queryStr += ` WHERE ${whereClause}`;
      }
  
      // Execute the query to count records
      const rows = await query(queryStr, valuesForWhereClause);
      const count = rows[0].count;
      return count;
    } catch (error) {
      throw new Error(`Error getting count from database: ${error.message}`);
    }
}


module.exports = { select, selectWithPagination, count };