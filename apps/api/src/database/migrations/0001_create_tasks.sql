CREATE TABLE tasks (
    id UUID PRIMARY KEY,

    title VARCHAR(200) NOT NULL,

    description TEXT,

    status VARCHAR(32) NOT NULL
        CHECK (
            status IN (
                'todo',
                'in_progress',
                'completed',
                'cancelled'
            )
        ),

    priority VARCHAR(16) NOT NULL
        CHECK (
            priority IN (
                'low',
                'normal',
                'high',
                'urgent'
            )
        ),

    due_at TIMESTAMPTZ,

    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL,

    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT tasks_completed_at_consistency
        CHECK (
            (
                status = 'completed'
                AND completed_at IS NOT NULL
            )
            OR
            (
                status <> 'completed'
                AND completed_at IS NULL
            )
        )
);

CREATE INDEX idx_tasks_status
    ON tasks (status);

CREATE INDEX idx_tasks_due_at
    ON tasks (due_at)
    WHERE due_at IS NOT NULL;

CREATE INDEX idx_tasks_priority
    ON tasks (priority);
