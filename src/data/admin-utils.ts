export function isAdminLoggedIn(param_cookie: any) {
    if (param_cookie == undefined || param_cookie == "")
        return false
    else
        return true;
}

export function getURLPath(){
    return "http://localhost:4321/"
    // return "https://smmproviders-org-admin.vercel.app/"
}