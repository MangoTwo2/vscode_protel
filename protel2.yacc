; PROTEL2 Language BNF Grammar

; Program Structure
<compilation-unit> ::= <section>

<section> ::= <section-head> [<permits-list>] [<declarations>]

<section-head> ::= [<mod-type>] <section-type> <identifier> [<uses>] ";"

<mod-type> ::= "fast" | "perprocess" | "definitions"

<section-type> ::= "interface" | "section"

<uses> ::= "uses" <usage-list> | "of" <identifier>

; Declarations
<declaration> ::= [<obsolete>] <type-decl>
                | [<obsolete>] <data-decl>
                | <alignment>
                | <resolve-stmt>
                | <inside-decl>
                | <bind-decl>

<type-decl> ::= "type" <named-type-id> "," <type-list>
               | "type" <named-type-id> <identifier> [<type-list-tail>]
               | "type" <named-type-id> <unnamed-type> [<type-list-tail>]
               | "type" <named-type-id> "class" <class-type-tail>
               | "type" <named-type-id> "abstract" "class" <class-type-tail>

; Types
<type> ::= [<type-properties>] [<type-modifiers>] <unmodified-type>

<unmodified-type> ::= <named-type>
                    | <subclass-type>
                    | <unnamed-type>

<unnamed-type> ::= <symbolic-type>
                 | <subrange-type>
                 | <pointer-type>
                 | <set-type>
                 | <table-type>
                 | <descriptor-type>
                 | <procedure-type>
                 | <struct-type>
                 | <area-type>
                 | <expansion-type>

; Expressions
<expression> ::= <secondary> | <expression> <binary-operator> <secondary>

<secondary> ::= <primary> | <unary-operator> <secondary>

<primary> ::= <numeric-constant> [<closed-tuple>]
            | <closed-tuple>
            | <storage-reference> [<closed-tuple>]
            | "(" <expression> ")" [<closed-tuple>]
            | "nil"
            | "round_up" "(" <expression> "," <expression> ")"

; Statements
<statement> ::= <expression-stmt>
              | <return-stmt>
              | <exit-stmt>
              | <closed-stmt>
              | <identifier> ":" <closed-stmt> [<identifier>]
              | <raise-stmt>
              | <retry-stmt>

<closed-stmt> ::= <block-stmt>
                | <if-stmt>
                | <case-stmt>
                | <select-stmt>
                | <inspect-stmt>
                | <loop-stmt>

; Control Structures
<if-stmt> ::= "if" <expression> "then" [<frequency-spec>] [<statements>] 
              [<else-if>] [<else>] "endif"

<loop-stmt> ::= <loop-control> "do" [<frequency-spec>] [<statements>] "enddo"

<case-stmt> ::= "case" <expression> "in" <case-body> "endcase"

; Class System
<class-body> ::= [<class-data>] [<class-methods>]

<class-methods> ::= "operations" <method-list>

<method-spec> ::= "method" "(" <receiver-spec> [<non-receiver-params>] ")" [<returns>]
                | "method"

; Operators
<binary-operator> ::= "->" | "+" | "-" | "*" | "/" | "<<" | ">>" | "=" 
                   | "^=" | "<" | ">" | "<=" | ">=" | "&" | "|" | "!" 
                   | "mod" | "incl" | "notincl" | "&:" | "|:"

<unary-operator> ::= "-" | "^" | "ptr" | "desc" | "upb" | "tdsize"

; Basic Elements
<identifier> ::= <named-type-id> | "any"

<named-type-id> ::= <basic-id>
                  | "class" | "inspect" | "operations" | "method"
                  | "$classdesc" | "raise" | "retry" | "readable"
                  | "writable" | "exclusive" | "rare" | "usual"
                  | "create" | "fixed" | "overriding"