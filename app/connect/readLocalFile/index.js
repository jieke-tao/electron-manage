/**
 * author      : denghm
 * createTime  : 2017/5/3 14:00
 * description : index
 */

import { port,mime,router } from './config'
import { server } from './server'

let uri = "http://localhost:" + port + "/" + router;
server.listen(port);

export default uri;
