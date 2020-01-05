import React, {Component, useState} from 'react';

import {
    PermissionsAndroid,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';

import {NavigationStackProp} from "react-navigation-stack";
import {Body, Button, Container, Content, Header, Icon, Left, Title} from "native-base";
import {DrawerActions} from "react-navigation-drawer";
import RNFetchBlob from 'rn-fetch-blob';

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// pdfMake.font= {
//     myFont: {
//         normal: 'assets/fonts/Roboto-Regular.ttf',
//         bold: 'assets/fonts/Roboto-Medium.ttf',
//         italics: 'assets/fonts/Roboto-Italic.ttf',
//         bolditalics: 'assets/fonts/Roboto-Italic.ttf'
//     },
// }

type Props = {
    navigation: NavigationStackProp;
};

export const PDFScreen = ({navigation}: Props) => {

    const [pdfObj, setPdfObj] = useState(null);
    var pdfFonts = require('pdfmake/build/vfs_fonts');

    const createPDF = (base64PDF) => {


        const RNFS = require('react-native-fs');
        let path: string = RNFS.ExternalStorageDirectoryPath;
        // var pdf_base64 = 'data:application/pdf;base64,JVBERi0xLjMNJeLjz9MNCjcgMCBvYmoNPDwvTGluZWFyaXplZCAxL0wgNzk0NS9PIDkvRSAzNTI0L04gMS9UIDc2NTYvSCBbIDQ1MSAxMzddPj4NZW5kb2JqDSAgICAgICAgICAgICAgICAgICAgICAgDQoxMyAwIG9iag08PC9EZWNvZGVQYXJtczw8L0NvbHVtbnMgNC9QcmVkaWN0b3IgMTI-Pi9GaWx0ZXIvRmxhdGVEZWNvZGUvSURbPDREQzkxQTE4NzVBNkQ3MDdBRUMyMDNCQjAyMUM5M0EwPjxGNkM5MkIzNjhBOEExMzQwODQ1N0ExRDM5NUEzN0VCOT5dL0luZGV4WzcgMjFdL0luZm8gNiAwIFIvTGVuZ3RoIDUyL1ByZXYgNzY1Ny9Sb290IDggMCBSL1NpemUgMjgvVHlwZS9YUmVmL1dbMSAyIDFdPj5zdHJlYW0NCmjeYmJkEGBgYmCyARIMIIKxAUgwpwIJNkcg8eUYAxMjwzSQLAMjucR_xp1fAAIMAEykBvANCmVuZHN0cmVhbQ1lbmRvYmoNc3RhcnR4cmVmDQowDQolJUVPRg0KICAgICAgICANCjI3IDAgb2JqDTw8L0ZpbHRlci9GbGF0ZURlY29kZS9JIDY5L0xlbmd0aCA1OC9TIDM4Pj5zdHJlYW0NCmjeYmBgYGFgYPzPAATcNgyogJEBJMvRgCzGAsUMDA0M3Azc0x50JoA4zAwMWgIQLYwsAAEGAL_iBRkNCmVuZHN0cmVhbQ1lbmRvYmoNOCAwIG9iag08PC9NZXRhZGF0YSAxIDAgUi9QYWdlcyA1IDAgUi9UeXBlL0NhdGFsb2c-Pg1lbmRvYmoNOSAwIG9iag08PC9Db250ZW50cyAxMSAwIFIvQ3JvcEJveFswIDAgNTk1IDg0Ml0vTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1BhcmVudCA1IDAgUi9SZXNvdXJjZXMgMTQgMCBSL1JvdGF0ZSAwL1R5cGUvUGFnZT4-DWVuZG9iag0xMCAwIG9iag08PC9GaWx0ZXIvRmxhdGVEZWNvZGUvRmlyc3QgOTQvTGVuZ3RoIDc3My9OIDEzL1R5cGUvT2JqU3RtPj5zdHJlYW0NCmjevFRtb9owEP4r_gPgl9hxIlVI0I6u0lqhJls_RPmQgguRQoISV6P_fncJLoG1K6XSiMz55e58vue545IwwhXhnibcJyKAlSaeCAgPiOeDCImUighGVMiI4CQUoCYIZ1oS4YGt5kRIsGIhEeAokLAGFcYkubigl1VR1dEmmxtcNAovY-R-NKLftvY6spnFg-uI4_XdwbQqLexNBcYAWzSOBQbQTSXe3k19vLibBnhnZz6rq3lkbEJnV1Mam61NR6OEXmbF_fUEr8rW6ywRQwE_iPRQpvQ2s3W-TdhQcnQ-FBwdDxkPPRCe0rjSXEFe2JDzUKAImEIdjZENQ8VUSh9WuTWzKi9t0m0ReOGQBSFEk0IY0Zg8ZUVjaHSLpoLG9_RmYUqb2xcav2zMPj-jEehf5U9Ppjbl3DQJp4_PRWFsulMs59UiL5et3iRrDCaQRi_rx6p4PURYMVXR86NFI7TkNK5-ljkoGMJ3ScUztG-djZs5RERCpiB_m-8mX64sYfTKdPsDwTmdFtmyAca0VpNJtU0GPtBn4GkkgQfMYDJI29O7bG3ouM6zYjCpisVtTG9sVuTzcbksDPiNrFn_Aip6-zDwqjrf2Ko-fN2BF_dG-pCX47LJX9fTvG7s5SqrXXx7d0hsfPCPbKfBub9PTv1sYpel1hBcL-yqSYRGSn7ta2nyKn3O39Dxff2hH6X81rovuxMXpZPuDi8IWy3P89I-wEHI3wPYdwDLHsDKR4CZBoCxUzCmewDH-do0d-b3fbXOyln0DsrsY4z_dnQW0IIfAa3lKUCrw2RDjWPa2tGmVu3_T4UcQe1me6iOAXXQO8hCKd_QlLCr2KHEyHCOo08ADcPt49i9A6ggeie7uBgj_-vTPku_1GV8BSQUypHQ08dd5nzqOfPzCOcdEg40Tmosny3JMOiXpNRdSXLBfMyGeL8k277ZZeYoRQOuPtOF_-n3vNypo2IV_Ixi3X-nFuipPfeDjsxccbr_rqgP-zHu9IoRCtEVo4tiV9JAiD8CDAA-0IrxDQplbmRzdHJlYW0NZW5kb2JqDTExIDAgb2JqDTw8L0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggMTUzMD4-c3RyZWFtDQpIibRXS2_jNhBGr_4Vc1uqiBW9H8d0tynQ02IroIduD7LEJCpk0RDppPlT_Y2dB2l7nS0KLFoEUPgacuabmW_GP3Sb267LIIXuYZMWcVJAgn8yytI8rqukgrqscZ7k0O03t-9tCYPlYwnYYXP70y8pPNrNNomTJKugGzY0qhroXja_qbsoTeJMjdG2jlNldhqibUpD3GjiWg3RNlNrtK3iCnd7Bx8_3MP9RAuNmrWNfu9-Jh0Lr2MmCmbQtHGbkXJZG-eZKMc6JK3XIaMR6zDiu3_BR7O6fjdr-GBQhyRu1XDc68XBfVTGucJFWlv3uJmjgqjLZ4Xa8ObnCCZLqieqh-MyPevV9rMsPEwzWZXhyKx7FONV9xRGh5WMb5W2en32L-sow2-4cZ7ZzAS2aZyW0H1gCJPGG9K2mRhiHqIcYYGI79dRgaDxRNbN4uzN5TxK8LvymKyKC9WzjHPTEm1b9MsjuadRN3ySRQc-IaKzOYq05S0RXkZ4lFWZH54mkbFRosDIvV5RL8GXvcpTYrLFm0XKWzEamR5JUdJUX4i6G5AXdbQtcc9r3dMs9waOorGIWQuIFWHafe-jogiRSSMCEwGE_nCYp6F3k1mgR8MOc-_IiXC0rEam9AjOwLBqCdEe3yqU0zC5OPgsi3PvspTC8BRxjJkEUCvYTh7HRWYjX1rypaWaxXMSQg8Somgc6NkfG_iYW80yDYQXQ5XhEsXwOFm3TrujmGJRPzAYpIPZawsUK1cBJqDUJ1BqUfywGsyQvQUU3Jtl5hda8h1mmQK9sFqYtua4OM2BXRNGL5N7Ik0HVs9LDcCpYZ96MgBTC4M-V9PyGNFlgt_tvWcfAbJhJFkrUkh9F3V_UPpX_lBcVJj-eAYBlZ3GE4NwV0id0htWtSXfc7e8mkXfoJNfX540elOEPaugEV6YYUm9cJ0KKDCgx8xBI7BIT9G2wUAjr2aKDYzhbiYqyBPGSZmjxPiiCR4OIZ4HAqHAE-JA_DCm_YxihoJOhfmw-oUeccMkYLy2rCu5sQjGpj6006SpROFPmrXr-TtGkk40XjE7ChVzpH3SA69NxHuNOkxyZOHjTiIVk4gEZExRdL7E8wwNEQOPBk8N3yCn9nK5aOJkYsFiVMrK5AcYcBcqL4Rxpd5FmIJVEEMPyPKlnvClBhZ2-vKiIx-yXj0yYIu1jbjoq-nwhiNGs7zDYEXw4akX7iYoiQPgzB-eGij1LDLHP1EGCZzTtqK0tVdJgPqU35gHxdfyQEJjG4ZkEhFSTYx7jVyotD6hsAUoLy4qzxeVclE_v_SvXByR-JEF4LBOSESDL6ZoiVpXzTNZc_PrVTXHRGov8i7JTvj7ggfMy1RbUUUmoca_MwkTUQXjxVE_iyPEP_U1vZDfi-K_xDb0GWndppfQpgRtjnQ3cTGqEdqe_xOZIgwvyIYp4fEaZdQKEHoogwSO1efLrWufUOvwluXkcS6NtfqzH97inF3hHDRvQ4dEFYNJh6OWbOi5QXF6pNIr7YtsEN5hex1n3yz5fobKLtYu7kOseXBkKwmtTL2jMBgKNPmZwr5MvSqkHvLt2gc3F_ysb3awNGdpiAes9Q7rlVAakfJlG0QlXQTZBmx_qFkJzQxnJ9WkSkmtXoyD2VgspkdNKRy6gbMtLIG2SNvmDbpq29LsnCo-jJ8xDZgQM_Y2Zh3G9bRgWnCiZGp_QL5CNtxN8-SIiNX_yQzbs5oUvkHLDvnpQfyPSQR3g4xWbss_6X4MLdFKvbA_1zN-5BJ2CJVGgm40L8ts-pG7KoksrKG7U-ELr2D8ZESPQfTUxiCJ7i5Z-hwqeXMR9UQOFE90QYW6YdtEs7CqsSX9dyC_mV1zgbBoGt8-vTfsSYz4gb9OflOcOsEaSfFUOHNPvumpvabxKnksG2D3sjr7kyvLYSmRZSqCPKXKGIQm_0NGjlKnzaPBX3n9tL9p9D6Tm2QR3fdVF4SI4ah9pHAFjl9EXUYghV0eY680_EukCF0CF2hl3QXtEelReBHnc6uh4Ff67sSBP3abvwcArRiH3QoNCmVuZHN0cmVhbQ1lbmRvYmoNMTIgMCBvYmoNPDwvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCAyMDg-PnN0cmVhbQ0KSIlUkL0OwjAMhPc-hUcQQ9rOVRdYOvAjCuxp4laRiBO56dC3JykFxBBL9uXTnS32zaEhE0Bc2KkWA_SGNOPoJlYIHQ6GoChBGxXWbqnKSg8iwu08BrQN9Q6qKhPXKI6BZ9i0s-3cc5dvQZxZIxsaYHMr7o84aCfvn2iRAuRQ16Cxz8T-KP1JWozyii7zYjV0GkcvFbKkAaHKi_pdkPS_9iG6_t3-vlZlXpZ1FomPluC0yddbTcwx1rLukihlMITfi3jnk2V62UuAAQBDyGk_Cg0KZW5kc3RyZWFtDWVuZG9iag0xIDAgb2JqDTw8L0xlbmd0aCAzNjU2L1N1YnR5cGUvWE1ML1R5cGUvTWV0YWRhdGE-PnN0cmVhbQ0KPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4yLjEtYzA0MyA1Mi4zNzI3MjgsIDIwMDkvMDEvMTgtMTU6MDg6MDQgICAgICAgICI-CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI-CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI-CiAgICAgICAgIDxkYzpmb3JtYXQ-YXBwbGljYXRpb24vcGRmPC9kYzpmb3JtYXQ-CiAgICAgICAgIDxkYzpjcmVhdG9yPgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaT5jZGFpbHk8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L2RjOmNyZWF0b3I-CiAgICAgICAgIDxkYzp0aXRsZT4KICAgICAgICAgICAgPHJkZjpBbHQ-CiAgICAgICAgICAgICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI-VGhpcyBpcyBhIHRlc3QgUERGIGZpbGU8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6QWx0PgogICAgICAgICA8L2RjOnRpdGxlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMDAtMDYtMjlUMTA6MjE6MDgrMTE6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPk1pY3Jvc29mdCBXb3JkIDguMDwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU-MjAxMy0xMC0yOFQxNToyNDoxMy0wNDowMDwveG1wOk1vZGlmeURhdGU-CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTMtMTAtMjhUMTU6MjQ6MTMtMDQ6MDA8L3htcDpNZXRhZGF0YURhdGU-CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpwZGY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8iPgogICAgICAgICA8cGRmOlByb2R1Y2VyPkFjcm9iYXQgRGlzdGlsbGVyIDQuMCBmb3IgV2luZG93czwvcGRmOlByb2R1Y2VyPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD51dWlkOjA4MDVlMjIxLTgwYTgtNDU5ZS1hNTIyLTYzNWVkNWMxZTJlNjwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ-dXVpZDo2MmQ2YWU2ZC00M2M0LTQ3MmQtOWIyOC03YzRhZGQ4ZjllNDY8L3htcE1NOkluc3RhbmNlSUQ-CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY-CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw_eHBhY2tldCBlbmQ9InciPz4NCmVuZHN0cmVhbQ1lbmRvYmoNMiAwIG9iag08PC9GaWx0ZXIvRmxhdGVEZWNvZGUvRmlyc3QgNC9MZW5ndGggNDgvTiAxL1R5cGUvT2JqU3RtPj5zdHJlYW0NCmjeMlUwULCx0XfOL80rUTDU985MKY62BIoFxeqHVBak6gckpqcW29kBBBgA1ncLgA0KZW5kc3RyZWFtDWVuZG9iag0zIDAgb2JqDTw8L0ZpbHRlci9GbGF0ZURlY29kZS9GaXJzdCA0L0xlbmd0aCAxNjcvTiAxL1R5cGUvT2JqU3RtPj5zdHJlYW0NCmjePMvBCsIwEEXRX5mdDaKdxCpVSqFY3AkuBNexSelA6EAyRfx7A4qPu3znAAhNU3aLTByLwVkKb1Weo7dCPPdWfNGfDOYdzFGj0VivtV4hrn6vrK40RE48Cjw4Oqi3qMoruz_WuwxrvTeV3m2w-uJbZLcMPhZdxk8r0FMSCsFHqLYII0d40Oz4lVR5Jwm-uE-UIGdBfBK49RcYKXjVth8BBgBnZztkDQplbmRzdHJlYW0NZW5kb2JqDTQgMCBvYmoNPDwvRGVjb2RlUGFybXM8PC9Db2x1bW5zIDMvUHJlZGljdG9yIDEyPj4vRmlsdGVyL0ZsYXRlRGVjb2RlL0lEWzw0REM5MUExODc1QTZENzA3QUVDMjAzQkIwMjFDOTNBMD48RjZDOTJCMzY4QThBMTM0MDg0NTdBMUQzOTVBMzdFQjk-XS9JbmZvIDYgMCBSL0xlbmd0aCAzNy9Sb290IDggMCBSL1NpemUgNy9UeXBlL1hSZWYvV1sxIDIgMF0-PnN0cmVhbQ0KaN5iYmBgYGLkPcLEwD-ViYGhh4mBkYWJ8bEkkM0IEGAAKlkDFA0KZW5kc3RyZWFtDWVuZG9iag1zdGFydHhyZWYNCjExNg0KJSVFT0YNCg==';
        // const temp = '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\nEW/16RUeqglGxxdazu8J1X4uzIuYDL0KfVSO5L97XgKPCmVuZHN0cmVhbQplbmRvYmoKMSAwIG9i\nago8PC9Hcm91cDw8L1R5cGUvR3JvdXAvQ1MvRGV2aWNlUkdCL1MvVHJhbnNwYXJlbmN5Pj4vUGFy\nZW50IDUgMCBSL0NvbnRlbnRzIDQgMCBSL1R5cGUvUGFnZS9SZXNvdXJjZXM8PC9Qcm9jU2V0IFsv\nUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXS9Db2xvclNwYWNlPDwvQ1MvRGV2aWNl\nUkdCPj4vRm9udDw8L0YxIDIgMCBSL0YyIDMgMCBSPj4+Pi9NZWRpYUJveFswIDAgNTk1IDg0Ml0v\nUm90YXRlIDkwPj4KZW5kb2JqCjYgMCBvYmoKWzEgMCBSL1hZWiAwIDYwNSAwXQplbmRvYmoKMiAw\nIG9iago8PC9CYXNlRm9udC9IZWx2ZXRpY2EvVHlwZS9Gb250L0VuY29kaW5nL1dpbkFuc2lFbmNv\nZGluZy9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjcgMCBvYmoKPDwvRm9udEJCb3ggWy0yNSAtMjU0\nIDEwMDAgODgwXS9DYXBIZWlnaHQgODgwL1N0eWxlPDwvUGFub3NlKAEFAgIEAAAAAAAAACk+Pi9U\neXBlL0ZvbnREZXNjcmlwdG9yL1N0ZW1WIDkzL0Rlc2NlbnQgLTEyMC9GbGFncyA2L0ZvbnROYW1l\nL1NUU29uZy1MaWdodC9Bc2NlbnQgODgwL0l0YWxpY0FuZ2xlIDA+PgplbmRvYmoKOCAwIG9iago8\nPC9CYXNlRm9udC9TVFNvbmctTGlnaHQvQ0lEU3lzdGVtSW5mbzw8L09yZGVyaW5nKEdCMSkvUmVn\naXN0cnkoQWRvYmUpL1N1cHBsZW1lbnQgND4+L1R5cGUvRm9udC9TdWJ0eXBlL0NJREZvbnRUeXBl\nMC9Gb250RGVzY3JpcHRvciA3IDAgUi9EVyAxMDAwPj4KZW5kb2JqCjMgMCBvYmoKPDwvRGVzY2Vu\nZGFudEZvbnRzWzggMCBSXS9CYXNlRm9udC9TVFNvbmctTGlnaHQtVW5pR0ItVUNTMi1IL1R5cGUv\nRm9udC9FbmNvZGluZy9VbmlHQi1VQ1MyLUgvU3VidHlwZS9UeXBlMD4+CmVuZG9iago1IDAgb2Jq\nCjw8L0lUWFQoMi4xLjcpL1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWzEgMCBSXT4+CmVuZG9iago5\nIDAgb2JqCjw8L05hbWVzWyhKUl9QQUdFX0FOQ0hPUl8wXzEpIDYgMCBSXT4+CmVuZG9iagoxMCAw\nIG9iago8PC9EZXN0cyA5IDAgUj4+CmVuZG9iagoxMSAwIG9iago8PC9OYW1lcyAxMCAwIFIvVHlw\nZS9DYXRhbG9nL1ZpZXdlclByZWZlcmVuY2VzPDwvUHJpbnRTY2FsaW5nL0FwcERlZmF1bHQ+Pi9Q\nYWdlcyA1IDAgUj4+CmVuZG9iagoxMiAwIG9iago8PC9DcmVhdG9yKEphc3BlclJlcG9ydHMgTGli\ncmFyeSB2ZXJzaW9uIDUuNi4wKS9Qcm9kdWNlcihpVGV4dCAyLjEuNyBieSAxVDNYVCkvTW9kRGF0\nZShEOjIwMTcxMjI5MTE0OTE0KzA4JzAwJykvQ3JlYXRpb25EYXRlKEQ6MjAxNzEyMjkxMTQ5MTQr\nMDgnMDAnKT4+CmVuZG9iagp4cmVmCjAgMTMKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAxODc1\nIDAwMDAwIG4gCjAwMDAwMDIxNjMgMDAwMDAgbiAKMDAwMDAwMjYwNSAwMDAwMCBuIAowMDAwMDAw\nMDE1IDAwMDAwIG4gCjAwMDAwMDI3MjkgMDAwMDAgbiAKMDAwMDAwMjEyOCAwMDAwMCBuIAowMDAw\nMDAyMjUxIDAwMDAwIG4gCjAwMDAwMDI0NDIgMDAwMDAgbiAKMDAwMDAwMjc5MiAwMDAwMCBuIAow\nMDAwMDAyODQ2IDAwMDAwIG4gCjAwMDAwMDI4NzkgMDAwMDAgbiAKMDAwMDAwMjk4NCAwMDAwMCBu\nIAp0cmFpbGVyCjw8L1Jvb3QgMTEgMCBSL0lEIFs8NzM3YjNiYTEyZTQ3ZjE4MDdlYjE1NDA1NjMw\nMDQyYWI+PDRiMzVlN2ZlOWU0YTM4YWU3ZDJiY2E1MTgzNmQ2NWZmPl0vSW5mbyAxMiAwIFIvU2l6\nZSAxMz4+CnN0YXJ0eHJlZgozMTUyCiUlRU9GCg=='

        requestExternalStoragePermission();
        const pathToWrite = path + '/123.pdf';
        console.log('pathToWrite', pathToWrite);

        RNFetchBlob.fs
            .writeFile(pathToWrite, base64PDF, 'base64')
            .then(() => {
                console.log('wrote file ${pathToWrite}');
                navigation.navigate('OpenPdfScreen');
            })
            .catch(error => console.error(error));
    }

    const requestExternalStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    buttonNegative: "", buttonNeutral: "", buttonPositive: "",
                    title: 'My App Storage Permission',
                    message: 'My App needs access to your storage ' +
                        'so you can save your photos'
                },
            );
            return granted;
        } catch (err) {
            console.error('Failed to request permission ', err);
            return null;
        }
    };


    const generatePdf = () =>
        new Promise(resolve => {
            let docDefinition = {
                content: [
                    {text: new Date().toLocaleString("pl-PL"), alignment: 'right'},

                    {text: 'Stworzono przez: 123123123'},

                ],

                // styles: {
                //     header: {
                //         fontSize: 18,
                //         bold: true,
                //     },
                //     subheader: {
                //         fontSize: 14,
                //         bold: true,
                //         margin: [0, 15, 0, 0]
                //     },
                //     additionalText: {
                //         italic: true,
                //         width: '50%',
                //     }
                // }
            };

            const pdfDocGenerator = pdfMake.createPdf(docDefinition)
            pdfDocGenerator.getBase64(pdfData => {

                let returnedItems = {
                    pdfData: 'data:application/pdf;base64,${pdfData}',
                    onlyData: pdfData,
                }

                resolve(returnedItems);
                createPDF(returnedItems.onlyData);
            })
        })



    return (
        <Container>
            <Header>
                <Left>
                    <Button
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                        <Icon name='menu'/>
                    </Button>
                </Left>
                <Body>
                    <Title>Wygeneruj PDF</Title>
                </Body>
            </Header>
            <Content
                contentContainerStyle={{
                    justifyContent: 'center',
                    flex: 1,
                    padding: 20,
                }}>
                <View>
                    <Button
                       >
                        <Text>Generuj PDF</Text>
                    </Button>
                    <Button onPress={() => generatePdf()}>
                        <Text>Pobierz PDF</Text>
                    </Button>
                </View>
            </Content>
        </Container>
    )
}

PDFScreen.navigationOptions = {
    header: null,
};

export default PDFScreen;
