const generateHtml = {
  authDropdown: (isLoggedIn, username="User")=>{
    if( isLoggedIn )
      return `
      <a class="dropdown-item" href="#">
          <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
          ${username}
      </a>
      <div class="dropdown-divider"></div>
      <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
          <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
          Logout
      </a>`;
    else
      return `
      <a class="dropdown-item" href="#" data-toggle="modal" data-target="#loginModal">
          <i class="fas fa-sign-in-alt fa-sm fa-fw mr-2 text-gray-400"></i>
          Login
      </a>
      <div class="dropdown-divider"></div>
      <a class="dropdown-item" href="#" data-toggle="modal" data-target="#registerModal">
          <i class="fas fa-sign-in-alt fa-sm fa-fw mr-2 text-gray-400"></i>
          Register
      </a>
      `;
  }
}

class Server{
  constructor(){
    this._TOKEN_STORAGE_NAME = "login-token";
    this._USER_STORAGE_NAME = "user-data";
    this._token = localStorage.getItem(this._TOKEN_STORAGE_NAME);
    this._BASE_URL = "/api/v1";

    this._authDropdownSelector = '#authDropdown';

    if( this._token ){
      const username = this.getUserData()?.username;
      $(this._authDropdownSelector).html(generateHtml.authDropdown(true, username));
    }else
      $(this._authDropdownSelector).html(generateHtml.authDropdown(false));
  }

  getBaseAjaxConfig(){
    return {
      contentType: "application/json",
      headers: {
        'Authorization': this._token
      },
    }
  }

  getUserData(){
    try {
      return JSON.parse(localStorage.getItem(this._USER_STORAGE_NAME));
    } catch (error) {
      return {};
    }
  }

  loginData(data){
    const { user, token } = data;
    localStorage.setItem(this._TOKEN_STORAGE_NAME, token);
    localStorage.setItem(this._USER_STORAGE_NAME, JSON.stringify(user));
    this._token = token;
    const username = user?.username;
    $(this._authDropdownSelector).html(generateHtml.authDropdown(true, username));
  }

  login(username, password){
    $.ajax({
      url: `${this._BASE_URL}/auth/login`,
      method: "POST",
      ...this.getBaseAjaxConfig(),
      data: JSON.stringify({
        username, password
      }),
      success: (res) => {
        this.loginData(res?.data);
        $("#loginModal").modal('hide');
        alert("Login success");
      },
      error: (res) =>{
        alert("Login failed");
      }
    });
  }

  register(name, username, password){
    $.ajax({
      url: `${this._BASE_URL}/auth/register`,
      method: "POST",
      ...this.getBaseAjaxConfig(),
      data: JSON.stringify({
        name, username, password
      }),
      success: (res) => {
        this.loginData(res?.data);
        $("#registerModal").modal('hide');
        alert("Register and login success");
      },
      error: (res) =>{
        alert("Register failed");
      }
    });
  }

  logout(){
    this._token = "";
    localStorage.removeItem(this._TOKEN_STORAGE_NAME);
    localStorage.removeItem(this._USER_STORAGE_NAME);
    $(this._authDropdownSelector).html(generateHtml.authDropdown(false));
  }

  getSchedulesAjaxConfig(){
    return {
      url: `${this._BASE_URL}/schedule`,
      method: "GET",
      ...this.getBaseAjaxConfig()
    };
  }

  getScheduleList(options = {}){
    const {onSuccess, onError} = options;
    $.ajax({
      ...this.getSchedulesAjaxConfig(),
      success: (res) => {
        if( typeof onSuccess === "function" ) onSuccess(res);
      },
      error: (res)=>{
        if( typeof onError === "function" ) onError(res);
      }
    });
  }

  getScheduleDetail(id, options = {}){
    const {onSuccess, onError} = options;
    $.ajax({
      url: `${this._BASE_URL}/schedule/${id}`,
      method: "GET",
      ...this.getBaseAjaxConfig(),
      success: (res) => {
        if( typeof onSuccess === "function" ) onSuccess(res);
      },
      error: (res)=>{
        if( typeof onError === "function" ) onError(res);
      }
    });
  }

  addSchedule(data, options = {}){
    const {onSuccess, onError} = options;
    $.ajax({
      url: `${this._BASE_URL}/schedule/`,
      method: "POST",
      ...this.getBaseAjaxConfig(),
      data: JSON.stringify(data),
      success: (res) => {
        if( typeof onSuccess === "function" ) onSuccess(res);
      },
      error: (res)=>{
        if( typeof onError === "function" ) onError(res);
      }
    });
  }

  deleteSchedule(id, options = {}){
    const {onSuccess, onError} = options;
    $.ajax({
      url: `${this._BASE_URL}/schedule/${id}`,
      method: "DELETE",
      ...this.getBaseAjaxConfig(),
      success: (res) => {
        if( typeof onSuccess === "function" ) onSuccess(res);
      },
      error: (res)=>{
        if( typeof onError === "function" ) onError(res);
      }
    });
  }

  sendCommand(state, color = { r: 0, g: 0, b: 0 }){
    $.ajax({
      url: `${this._BASE_URL}/device/command/`,
      method: "POST",
      ...this.getBaseAjaxConfig(),
      data: JSON.stringify({
        command: {state, color}
      }),
      success: (res) => {
        alert("Command Sent!");
      },
      error: (res)=>{
        if( res.responseJSON.code >= 400 && res.responseJSON.code < 500 )
          alert("Please login first or re-login.");
        else
          alert("Command Send Failed!");
      }
    });
  }
}

let server = new Server();

$('#logout-button').on('click', ()=>{
  server.logout();
});

$('#loginForm').on('submit', (e)=>{
  e.preventDefault();
  const username = $("#loginForm input[name=username]").val();
  const password = $("#loginForm input[name=password]").val();
  server.login(username, password);
});

$('#registerForm').on('submit', (e)=>{
  e.preventDefault();
  const name = $("#registerForm input[name=name]").val();
  const username = $("#registerForm input[name=username]").val();
  const password = $("#registerForm input[name=password]").val();
  const rePassword = $("#registerForm input[name=repassword]").val();
  if( password !== rePassword ){
    return alert('Password Mismatch!');
  }
  server.register(name, username, password);
});

// Route based script
function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(color) {
  const {r, g, b} = color;
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

let activeScheduleId = null;
const pathname = window.location.pathname;

$(`li[data-menu='${pathname}']`).addClass('active');

function confirmDeleteSchedule(id){
  const ok = confirm('Are you sure want to delete this schedule?');
  if( ok ){
    server.deleteSchedule(id, { onSuccess: ()=>{
      $('#scheduleModal').modal('hide');
      getSchedulesData();
    } });
  }
}


let scheduleTable;
let scheduleDetailMode = "add";
const getScheduleDetail = (id)=>{
  scheduleDetailMode = "put";
  activeScheduleId = id;
  server.getScheduleDetail(id, {
    onSuccess: (res)=>{
      const { name, when, command } = res?.data;
      const { state, color } = JSON.parse(command);
      $('#scheduleForm input[name=name]').val(name);
      $('#scheduleForm input[name=when]').val(dayjs(when).format('YYYY-MM-DD\THH:mm'));
      $('#scheduleForm select[name=state]').val(state);
      $('#scheduleForm input[name=color]').val(rgbToHex(color));

      $('#scheduleModal').modal('show');
    }
  })
}
const getSchedulesData = ( renderAll = false )=>{
  
  server.getScheduleList({
    onSuccess: (res)=>{
      scheduleTable?.destroy();
      let data = res?.data;
      if( !renderAll ) data = data?.filter(el=> dayjs(el.when).isAfter(dayjs()));
      const renderedData = data?.map(el => [
          el.id,
          el.name,
          dayjs(el.when).format("YYYY-MM-DD HH:mm"),
          `<button class="btn btn-primary" onclick="getScheduleDetail('${el.id}')" aria-label="View Detail"><i class="fas fa-eye"></i></button>&nbsp;
          <button class="btn btn-danger" onclick="confirmDeleteSchedule('${el.id}')" aria-label="Delete"><i class="fas fa-trash"></i></button>
          `
        ]
      )
      scheduleTable = $('#scheduleTable').DataTable({
        stateSave: true,
        stateDuration: -1,
        responsive: true,
        autoWidth: false,
        processing: true,
        cache: false,
        order: [
            [2, "desc"]
        ],
        columnDefs: [{
            targets: "no-sort",
            orderable: false
        }],
        data: renderedData
      });
    }
  })
}

switch(pathname){
  case '/':
    $('#colorSelectorActive').on('change',(e)=>{
      const color = hexToRgb(e.target.value);
      server.sendCommand('ON', color);
    })
  break;
  case '/schedule':
    document.title = `Schedule | ${document.title}`;

    // Get initial data
    getSchedulesData();

    // Hook events
    $('#scheduleForm').on('submit', (e)=>{
      e.preventDefault();
      const name = $('#scheduleForm input[name=name]').val();
      const when = $('#scheduleForm input[name=when]').val();
      const state = $('#scheduleForm select[name=state]').val();
      const color = $('#scheduleForm input[name=color]').val();
      if( scheduleDetailMode === "add" ){
        server.addSchedule({
          name: name,
          when: when,
          command: {
            state: state,
            color: hexToRgb(color)
          }
        }, {
          onSuccess: (res)=>{
            $('#scheduleModal').modal('hide');
            getSchedulesData();
            e.target.reset();
          }
        })
      }else{
        alert('You cannot save haha! Just delete and make a new one');
      }
    });
    $('#addScheduleButton').on('click', ()=>{
      if( scheduleDetailMode !== "add" ) document.getElementById('scheduleForm').reset();
      activeScheduleId = null;
      scheduleDetailMode = "add";
    })
    $('#deleteScheduleButton').on(('click',()=>{
      confirmDeleteSchedule(activeScheduleId);
    }));
  break;
}