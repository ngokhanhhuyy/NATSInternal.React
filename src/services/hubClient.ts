import {
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
    LogLevel } from "@microsoft/signalr";
import type { ResourceAccessMode } from "./dtos/enums";

let connection: HubConnection;

export interface Resource {
    type: string;
    primaryId: number;
    secondaryId: number | null;
    mode: ResourceAccessMode
}

type NotificationSingleResponseHandler =
    (resource: Resource, responseDto: ResponseDtos.Notification.Single) => any;
type SelfResourceAccessStartedHandler =
    (resource: Resource, responseDto: ResponseDtos.User.Basic[]) => any;
type OtherUserResourceAccessStartedHandler =
    (resource: Resource, responseDto: ResponseDtos.User.Basic) => any;
type OtherUserResourceAccessFinishedHandler =
    (resource: Resource, userId: number) => void;

export interface IHubClient {
    isConnected: boolean;
    startConnection(): Promise<void>;
    stopConnection(): Promise<void>;
    startResourceAccess(resource: Resource): Promise<void>;
    finishResourceAccess(resource: Resource): Promise<void>;
    onNotificationSingleResponse(handler: NotificationSingleResponseHandler): void;
    offNotificationSingleResponse(handler: NotificationSingleResponseHandler): void;
    onSelfResourceAccessStarted(handler: SelfResourceAccessStartedHandler): void;
    offSelfResourceAccessStarted(handler: SelfResourceAccessStartedHandler): void;
    onOtherUserResourceAccessStarted(handler: OtherUserResourceAccessStartedHandler): void;
    offOtherUserResourceAccessStarted(handker: OtherUserResourceAccessStartedHandler): void;
    onOtherUserResourceAccessFinished(handler: OtherUserResourceAccessFinishedHandler): void;
    offOtherUserResourceAccessFinished(handler: OtherUserResourceAccessFinishedHandler): void;
}

export function useHubClient(): IHubClient {
    // Establish the connection if not established yet.
    if (!connection) {
        connection = buildConnection();
    }

    return {
        get isConnected(): boolean {
            return connection.state === HubConnectionState.Connected;
        },
        async startConnection(): Promise<void> {
            if (connection.state === HubConnectionState.Disconnected) {
                await connection.start();
                console.log("Hub connection established.");
                return;
            }
            throw new Error("Connection is at state " + connection.state.toString());
        },

        async stopConnection(): Promise<void> {
            if (connection.state === HubConnectionState.Connected) {
                await connection.stop();
                console.log("Hub connection terminated.");
                return;
            }
            throw new Error("Connection is at state " + connection.state.toString());
        },

        async startResourceAccess(resource: Resource): Promise<void> {
            await connection.send("StartResourceAccess", resource);
        },

        async finishResourceAccess(resource: Resource): Promise<void> {
            await connection.send("FinishResourceAccess", resource);
        },

        onNotificationSingleResponse(handler: NotificationSingleResponseHandler): void {
            connection.on("NotificationSingleResponse",  handler);
        },

        offNotificationSingleResponse(handler: NotificationSingleResponseHandler): void {
            connection.off("NotificationSingleResponse", handler);
        },

        onSelfResourceAccessStarted(handler: SelfResourceAccessStartedHandler): void {
            connection.on("Self.ResourceAccessStarted", handler);
        },

        offSelfResourceAccessStarted(handler: SelfResourceAccessStartedHandler): void {
            connection.off("Self.ResourceAccessStarted", handler);
        },

        onOtherUserResourceAccessStarted(
                handler: OtherUserResourceAccessStartedHandler): void {
            connection.on("Other.ResourceAccessStarted", handler);
        },

        offOtherUserResourceAccessStarted(
                handler: OtherUserResourceAccessStartedHandler): void {
            connection.off("Other.ResourceAccessStarted", handler);
        },

        onOtherUserResourceAccessFinished(
                handler: OtherUserResourceAccessFinishedHandler): void {
            connection.on("Other.ResourceAccessFinished", handler);
        },

        offOtherUserResourceAccessFinished(
                handler: OtherUserResourceAccessFinishedHandler): void {
            connection.off("Other.ResourceAccessFinished", handler);
        }
    };
}

function buildConnection(): HubConnection {
    return new HubConnectionBuilder()
        .withUrl(`/api/hub`)
        .configureLogging(LogLevel.Information)
        .build();
}