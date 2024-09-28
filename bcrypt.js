const bcrypt = require('bcrypt');

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';

(async () => {
    console.log(await bcrypt.hash("TooJoo_1967", 7));
})();

// $2b$07$mGwL7yzMVDad4GSvhVm/feLZ/UhwTlNJchPDUTib8hn5yyPsWNK0e
