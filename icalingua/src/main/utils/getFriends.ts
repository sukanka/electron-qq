import {getCookies, getUin} from '../ipc/botAndStorage'
import getGTk from '../../utils/getGTk'
import GetFriendsRet from '../../types/GetFriendsRet'
import axios from 'axios'
import GroupOfFriend from '../../types/GroupOfFriend'

export default async (): Promise<GroupOfFriend[]> => {
    const cookies = await getCookies('qzone.qq.com')
    const gTk = getGTk(cookies.p_skey)
    const uin = getUin()

    const data: GetFriendsRet = (await axios.get(`https://mobile.qzone.qq.com/friend/mfriend_list?qzonetoken=&g_tk=${gTk}&res_uin=${uin}&res_type=normal&format=json&count_per_page=10&page_index=0&page_type=0&mayknowuin=&qqmailstat=`, {
        headers: {
            Cookie: `uin=${cookies.uin}; skey=${cookies.skey}; p_uin=${cookies.p_uin}; p_skey=${cookies.p_skey}`,
        },
        proxy: false,
    })).data

    if (!(data && data.code === 0)) return []

    const map: { [p: number]: GroupOfFriend } = {}
    for (const i of data.data.gpnames) {
        map[i.gpid] = {
            name: i.gpname,
            friends: [],
        }
    }
    for (const i of data.data.list) {
        map[i.groupid].friends.push({
            uin: i.uin,
            nick: i.nick,
            remark: i.remark,
            sc: i.searchField.toUpperCase(),
        })
    }
    return Object.values(map)
}
