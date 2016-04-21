/**
 * Local dev setup script
 * 
 * Used to load .env files, which host the environment variables required to
 * test and develop. This script will load a .env.local file from the project
 * root and export each of the environment variables contained.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
(function() {
    try {
        require('dotenv').config({ path: './.env.local' });
    } catch(fileError) {
        console.error("Error loading local config from ./.env.local");
        exit();
    }
    
})();