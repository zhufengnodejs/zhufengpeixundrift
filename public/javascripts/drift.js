$(function(){
    $('#regModal').on('hidden.bs.modal', function (e) {
        var username = $('#username').val();
        if(username){
            var formData = new FormData();
            formData.append('username',username);
            formData.append('avatar',$('#avatar')[0].files[0]);
            $.ajax({
                url:"/users/add",
                type:'POST',
                data:formData,
                dataType:'json',
                processData:false,
                contentType:false
            }).done(function(result){
                if(result['code']==1){
                    var userInfo = result['msg'];
                    $('#regBtnDiv').css('display','none');
                    $('#regInfoDiv').css('display','block');
                    $('#myUsername').text(userInfo.username);
                    $('#myAvatar').attr('src',userInfo.avatar);
                }else{

                }
            });
        }
    })

    $('#throwModal').on('hidden.bs.modal', function (e) {
        var content = $('#content').val();
        if(content){
            $.ajax({
                url:"/bottle/throw",
                type:'POST',
                data:{content:content},
                dataType:'json'
            }).done(function(result){
                if(result['code']==1){

                }else{

                }
            });
        }
    });
})

function logout(){
    $.ajax({
        url:"/users/logout",
        type:'GET'
    }).done(function(result){
        if(result['code']==1){
            $('#regBtnDiv').css('display','block');
            $('#regInfoDiv').css('display','none');
        }else{

        }
    });
}