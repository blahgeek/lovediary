default_items = [
    ['2014-02-20T16:00:27+08:00', '(demo)We had an argue for nothing', -0.65],
    ['2014-02-23T12:10:17+08:00', '(demo)You still won\'t answer my phone', -0.8],
    ['2014-02-24T23:46:25+08:00', '(demo)I feel better now, please answer my phone, I love you.', -0.15],
    ['2014-02-25T03:06:45+08:00', '(demo)Mua~', 0.75],
    ['2014-03-01T08:03:05+08:00', '(demo)Good weather today, good to be together', 0.85],
    ['2014-03-03T10:03:05+08:00', '(demo)Mua~', 0.9],
    ['2014-03-04T11:04:15+08:00', '(demo)So much homework T T', 0.7],
    ['2014-03-10T09:33:03+08:00', '(demo)WTF', -0.15],
    ['2014-03-17T22:13:25+08:00', '(demo)Thanks for that', 0.3],
];

mood_val = 0.45;
items = [];
var $left_input = $('.left-page input[type="range"]');
var $right_input = $('.right-page input[type="range"]');
var set_left = function(val) {
    $left_input.css('background-image',
        '-webkit-gradient(linear, left top, right top, '
            + 'color-stop(' + val + ', #eaeaea), '
            + 'color-stop(' + val + ', #3498db)'
            + ')'
        );
};
var set_right = function(val) {
    $right_input.css('background-image',
        '-webkit-gradient(linear, left top, right top, '
            + 'color-stop(' + val + ', #e67e22), '
            + 'color-stop(' + val + ', #eaeaea)'
            + ')'
        );
};
$left_input.change(function () {
    var $this = $(this);
    var val = ($this.val() - $this.attr('min')) / ($this.attr('max') - $this.attr('min'));
    $right_input.val(0);
    set_right(0);
    set_left(val);
    mood_val = -(1-val);
    console.log('Mood: ' + mood_val);
});
$right_input.change(function () {
    var $this = $(this);
    var val = ($this.val() - $this.attr('min')) / ($this.attr('max') - $this.attr('min'));
    $left_input.val(100);
    set_right(val);
    set_left(1);
    mood_val = val;
    console.log('Mood: ' + mood_val);
});

var sync_to_storage = function() {
    localStorage.setItem('items', JSON.stringify(items));
};

var sync_from_storage = function() {
    items = JSON.parse(localStorage.getItem('items'));
    if(items === null) items = [];
};

var insert_row = function(title, text, val) {
    var $row_container = $('<div>').addClass('row bar-container');
    if(val < 0) $row_container.addClass('left');
    var v = (val < 0 ? -val : val) * 100;
    var $bar = $('<div>').addClass('bar').attr('data-title', title).attr('data-text', text);
    $row_container.append($bar);
    $row_container.insertAfter($('.right-page .input'));
    setTimeout(function(){ $bar.css('width', v + '%'); }, 0);
    $bar.qtip({
        content: {
            text: function(event, api){
                return $(this).attr('data-text');
            },
            title: function(event, api){
                var time = moment($(this).attr('data-title'));
                return time.fromNow();
            }
        },
        position: {
            my: val > 0 ? 'center left' : 'center right',
            at: val > 0 ? 'center right' : 'center left'
        }
    });
};

var remove_row = function() {
    var $e = $('.row.bar-container');
    if($e.length){
        $e = $($e[0]);
        $e.remove();
    }
};

$('#btn-add').click(function(){
    if(items.length === 0) $('.row.bar-container').remove();
    var time = moment().format();
    var text = $('#text').val();
    insert_row(time, text, mood_val);
    items.push([time, text, mood_val]);
    sync_to_storage();
});

$('#btn-remove').click(function(){
    remove_row();
    items.pop();
    sync_to_storage();
});

$(document).ready(function(){
    sync_from_storage();
    var its = items;
    if(its.length === 0) its = default_items;
    for(var i = 0 ; i < its.length ; i += 1){
        var x = its[i];
        insert_row(x[0], x[1], x[2]);
    }
});

