/* eslint-disable indent */

/**
 * checks for the existence of any data in the database
 * @param {object} model The database model.
 * @param {object} searchParam The search parameter needed to query the database.
 * @returns {boolean} existing
 */
const findRecord = async (model, searchParam) => {
    const existing = await model.findOne({ where: searchParam });
    return existing;
};

export default { findRecord };
