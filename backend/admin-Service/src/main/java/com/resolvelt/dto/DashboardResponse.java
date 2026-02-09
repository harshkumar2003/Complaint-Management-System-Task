package com.resolvelt.dto;

public class DashboardResponse {

    private long open;
    private long inProgress;
    private long resolved;

    public DashboardResponse(long open, long inProgress, long resolved) {
        this.open = open;
        this.inProgress = inProgress;
        this.resolved = resolved;
    }

    // getters
}
