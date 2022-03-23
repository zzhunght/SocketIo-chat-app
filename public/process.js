const socket = io("http://localhost:8000")
$(document).ready(function() {
    $('.form-user').show();
    $('.chat-gruop').hide();

    $('#btn').click(function() {
        if(!$('#username').val()){
            alert('Vui lòng nhập tên của bạn')
        }
        else{
            const data  = $('#username').val()
            socket.emit('client-send-data', data)
        }
    })
    $('.log-out-btn').click(function() {
        socket.emit('client-log-out')
    })
    $('#send').click(function() {
        if(!$('#txtMsg').val()){

        }
        else{
            const mes  = $('#txtMsg').val()
            socket.emit('client-send-msg', mes)
            $('#txtMsg').val('') 
        }
    })
    $('#txtMsg').focusin(()=>{
        socket.emit('client-focus-in')
    })
    $('#txtMsg').focusout(()=>{
        socket.emit('client-focus-out')
    })
})

socket.on('sv-send-failure-register',()=>{
    alert('username này đã được sử dụng')
})
socket.on('sv-send-success-register',(data)=>{
    $('.form-user').hide();
    $('.chat-gruop').show();
    $('#user-name-current').append(data)
})
socket.on('sv-send-ds-user',(data)=>{
    let html = data.map(data => {
        return  `<div id="user-name">${data}</div>`
    }   
    )
    console.log(html.join(''));
    document.getElementById('user-online-list').innerHTML = html.join('')
    
})
socket.on('log-out-success',()=>{
    $('.form-user').show();
    $('.chat-gruop').hide();
    $('#user-name-current').html('');
})
socket.on('some-one-send-msg',(data)=>{
    const html = `<div class="ms">
        <span classname="ms-from-user">${data.us}</span> :
        <span classname="ms-text">${data.msg}</span> 
    </div>`
    $('.box-chat-content').append(html)
})
socket.on('your-msg',(data)=>{
    const html = `<div class="your-ms">
        <span classname="ms-from-user">Bạn</span> :
        <span classname="ms-text">${data}</span> 
    </div>`
    $('.box-chat-content').append(html)
})
socket.on('users-focus-in',(data)=>{
    console.log(data)
    const htmls = data.map(u =>{
        return `<div class="smo-typing">
        <img src="typing.gif" width='30px'/>
        <span class="name-typing">
            ${data} đang nhập
        </span>
        </div>`
    })
    $('.us-typing').html(htmls)
})