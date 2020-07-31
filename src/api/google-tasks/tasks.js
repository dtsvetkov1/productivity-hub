const gapi = window.gapi;

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');


export default gapi;

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        // listTaskLists();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
export function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
export function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}


/**
 * Print task lists.
 */
export async function getLists() {
    const response = await gapi.client.tasks.tasklists.list({
        'maxResults': 10
    })

    return await response.result.items;
    // return gapi.client.tasks.tasklists.list({
    //     'maxResults': 10
    // }).then(function (response) {
    //     // var taskLists = response.result.items;
    //     // console.log('taskLists ', taskLists)
    //     return response.result.items
    // });
}


/**
 * Print tasks by taskname
 */
export async function getTasks(tasklist) {
    const response = await gapi.client.tasks.tasks.list({
        tasklist,
        'maxResults': 10
    })

    return await response.result.items;
    // return gapi.client.tasks.tasklists.list({
    //     'maxResults': 10
    // }).then(function (response) {
    //     // var taskLists = response.result.items;
    //     // console.log('taskLists ', taskLists)
    //     return response.result.items
    // });
}

export async function addTask({ tasklist, title, due }) {
    // const response = 
    const response = await gapi.client.tasks.tasks
    .insert({
        tasklist,
        'maxResults': 10
    },{title, due})
    console.log(response.result)

    return response.result;
}


export async function removeTask({ tasklist, task }) {
    // const response = 
    const response = await gapi.client.tasks.tasks
    .delete({
        tasklist,
        task
    })

    return response;
}
