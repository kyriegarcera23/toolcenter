module.exports = (req) => {
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    if(!req.body.advisory_data)
    {
        validation.is_error = true;
        validation.errors.push({advisory_data: 'Invalid Input'});
    }

    if(!req.body.business_impact)
    {
        validation.is_error = true;
        validation.errors.push({business_impact: 'Invalid Input'});
    }

    if(!req.body.header)
    {
        validation.is_error = true;
        validation.errors.push({header: 'Invalid Input'});
    }

    if(!req.body.location_id)
    {
        validation.is_error = true;
        validation.errors.push({location_id: 'Invalid Input'});
    }

    if(!req.body.site_id)
    {
        validation.is_error = true;
        validation.errors.push({site_id: 'Invalid Input'});
    }

    return validation;
}