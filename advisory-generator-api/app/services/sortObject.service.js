module.exports =  (arr_obj, obj_key,sort_type='asc') => {
    if(sort_type == 'asc')
    {
        arr_obj.sort((a,b) => {
            return a[obj_key].localeCompare(b[obj_key]);
        });
    }
    else
    {
        arr_obj.sort((a,b) => {
            return b[obj_key].localeCompare(a[obj_key]);
        });
    }

    return arr_obj;
}