const AD = require('ad');

module.exports = async (username, password) => {
    // Your AD account should be a member
    // of the Administrators group.
    const ad = new AD({
        url: process.env.LDAP_HOST,
        user: process.env.LDAP_USER,
        pass: process.env.LDAP_PASS
        // user: "aosebastian@toc.local", 
        // pass: "Interglobe01"
    });
    let metadata = {authenticated: false,data: {},message: ''};
    const existed = await ad.user(username).exists();

    if(existed === true)
    {
        const authenticated = await ad.user(username).authenticate(password);
        if(authenticated === true)
        {
            metadata.authenticated = true;
            metadata.data = await ad.user(username).get();
            metadata.message = 'Succesfully authenticated.';
        }
        else
        {
            ad.user(username).unlock()
            .catch(err => {
                console.log(err)
            });
            metadata.message = 'Invalid credentials.';
        }
    }
    else
    {
        metadata.message = 'Account does not exist.';
    }

    return metadata;
}