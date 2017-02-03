:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_error)).
:- use_module(library(http/html_write)).

:- use_module(library(http/json)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).

:- use_module(library(http/http_files)).

:- multifile http:location/3.
:- dynamic http:location/3.

http:location(files, '/f', []).

:- http_handler(files(.), http_reply_from_files('.', []), [prefix]).
:- http_handler('/formUp', say_why, []).
:- http_handler('/init1', home_page(1), []).
:- http_handler('/init2', home_page(2), []).
:- http_handler('/init3', home_page(3), []).

page(Dict, Text) :-
    Dict = [_{key: 'page', helpvalue: Text}].
form1(Dict) :-
    Dict = [_{key: 'form1', notitle: true, add: null, remove:null, items:['form1[]', _{type:'submit', title: 'Save'}]}].
form1_handler(Resp, Reply) :-
    _{form1: _{stuff: Text}} :< Resp, !,
    page(Reply, Text).


:- dynamic(comment/2).
comment_block(Dict, Author, Comment) :-
    Dict = _{key: 'comment', author: Author, comment: Comment}.
form2(Dict) :-
    Dict = [_{key: 'form2', notitle: true, add: null, remove:null}].
commentPage(Page) :-
    form2(Form),
    findall(Author-Comment, comment(Author, Comment), Bag),
    pairs_keys_values(Bag, Authors, Comments), maplist(comment_block, CommentBlocks, Authors, Comments),
    append(Form, CommentBlocks, Page).
form2_handler(Resp, Reply) :-
    _{form2: _{author: NewAuthor, comment: NewComment}} :< Resp, !,
    asserta(comment(NewAuthor, NewComment)),
    commentPage(Reply).

:- dynamic(userpass/2).
loginForm(Dict) :-
    Dict = [_{key: 'login', notitle: true, add: null, remove:null}].
registerForm(Dict) :-
    Dict = [_{key: 'register', notitle: true, add: null, remove:null}].
loginPage(Dict) :-
    %% registerForm(Dict).
    loginForm(Login), registerForm(Register),
    Dict = [_{type: 'tabs', tabs:[_{title:'Log In', items: Login}, _{title:'Register', items: Register}]}].
welcome(Dict, Username) :-
    string_concat('Welcome ', Username, Text),
    page(Dict, Text).
nosuchuser(Dict, Username) :-
    reverse(['User ', Username, ' does not exist'], List), foldl(string_concat, List, '', Text),
    page(Dict, Text).
badpass(Dict) :-
    page(Dict, 'Bad user/pass combo, please try again.').
regMess(Dict) :-
    page(Dict, 'Registration successful!').
form3_handler(Resp, Reply) :-
    _{login: _{user: User, pass: Pass}} :< Resp, !,
    login(User, Pass, Reply).
form3_handler(Resp, Reply) :-
    _{register: _{user: User, pass: Pass}} :< Resp, !,
    register(User, Pass, Reply).
login(User, Pass, Reply) :-
    userpass(User, Pass),
    welcome(Reply, User).
login(User, Pass, Reply) :-
    not(userpass(User, _)),
    nosuchuser(Page, User),
    loginPage(Form),
    append(Page, Form, Reply).
login(User, Pass, Reply) :-
    badpass(Message),
    loginPage(Form),
    append(Message, Form, Reply).
register(User, Pass, Reply) :-
    assertz(userpass(User, Pass)),
    regMess(Message),
    loginPage(Form),
    append(Message, Form, Reply).


home_page(1, Request) :-
    form1(Json),
    reply_json_dict(Json).

home_page(2, Request) :-
    commentPage(Json),
    reply_json_dict(Json).

home_page(3, Request) :-
    loginPage(Json),
    reply_json_dict(Json).

say_why(Request) :-
    http_read_json_dict(Request, Json),
    (form1_handler(Json, Resp); form2_handler(Json, Resp); form3_handler(Json, Resp)),
    reply_json_dict(Resp).

server(Port) :-
    http_server(http_dispatch, [port(Port)]).
