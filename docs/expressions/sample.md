# Data Query Language Expressions

## Call Clause

Runs `JAVASCRIPT_EXPRESSION`.

```text
?call JAVASCRIPT_EXPRESSION ?
```

## From Clause

Retrieves property resolved from `@PATH_EXPRESSION` relative to context Object and optionally transformed with `then TRANSFORM` chain transformers.

```text
?from @PATH_EXPRESSION [then TRANSFORM
                                [... then TRANSFORM(argument)]] ?
```

## Set Clause
Single property assignment syntax.

Returned value of `JAVASCRIPT_EXPRESSION` that is optionally transformed with `then TRANSFORM` chain transformers will be assigned to property resolved from `@PATH_EXPRESSION` relative to context Object.

```text
?set @PATH_EXPRESSION JAVASCRIPT_EXPRESSION [then TRANSFORM
                                [... then TRANSFORM(argument)]] ?
```

## Assign Clause

Multiple property assignment syntax.

Returned Object properties of `JAVASCRIPT_EXPRESSION` that is optionally transformed with `then TRANSFORM` chain transformers will be applied to property resolved from `@PATH_EXPRESSION` relative to context Object.

This requires `JAVASCRIPT_EXPRESSION` with optional transformers to return an Object. Also, only hasOwnProperty properties of the returned Obect is assigned.

```text
?assign @PATH_EXPRESSION JAVASCRIPT_EXPRESSION [then TRANSFORM
                                [... then TRANSFORM(argument)]] ?
```

