# Routes

## Kanban

```tsx
<Routes>
  <Route file="root.tsx">
    <Route path="dashboard" file="routes/dashboard.tsx">
      <Route path=":project" file="routes/dashboard/$project.tsx">
        <Route path="columns" file="routes/dashboard/$project/columns.tsx">
          <Route
            path=":column"
            file="routes/dashboard/$project/columns/$column.tsx"
          />
          <Route index file="routes/dashboard/$project/columns/index.tsx" />
          <Route path="new" file="routes/dashboard/$project/columns/new.tsx" />
        </Route>
        <Route path="tasks" file="routes/dashboard/$project/tasks.tsx">
          <Route index file="routes/dashboard/$project/tasks/index.tsx" />
          <Route path="new" file="routes/dashboard/$project/tasks/new.tsx" />
        </Route>
      </Route>
      <Route index file="routes/dashboard/index.tsx" />
      <Route path="new" file="routes/dashboard/new.tsx" />
    </Route>
    <Route path="logout" file="routes/logout.tsx" />
    <Route index file="routes/index.tsx" />
    <Route path="login" file="routes/login.tsx" />
  </Route>
</Routes>
```

## Demo

```tsx
<Routes>
  <Route file="root.tsx">
    <Route path="logout" file="routes/logout.tsx" />
    <Route index file="routes/index.tsx" />
    <Route path="login" file="routes/login.tsx" />
    <Route path="posts" file="routes/posts.tsx">
      <Route path=":slug" file="routes/posts/$slug.tsx" />
      <Route path="admin" file="routes/posts/admin.tsx">
        <Route path=":slug" file="routes/posts/admin/$slug.tsx" />
        <Route index file="routes/posts/admin/index.tsx" />
      </Route>
      <Route index file="routes/posts/index.tsx" />
    </Route>
  </Route>
</Routes>
```
