import { EventEmitter } from 'events';
import { AccessManager } from 'twilio-common';

export type ClientLogLevels = 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface ClientOptions {
  logLevel?: ClientLogLevels;
}

export class Client extends EventEmitter {
  constructor(accessManager: AccessManager, options?: ClientOptions);

  // properties
  accessManager: any;
  reachabilityEnabled: boolean;
  channels: Map<string, Channel>;
  userInfo: UserInfo;
  identity: string;
  readonly connectionState: ConnectionState;
  readonly version: string;

  // methods
  createChannel(options?: CreateChannelOptions): Promise<Channel>;
  getChannelBySid(channelSid: string): Promise<Channel>;
  getChannelByUniqueName(uniqueName: string): Promise<Channel>;
  getChannels(): Promise<Channel[]>;
  initialize(): Promise<Client>;
  shutdown(): void;

  // events
  on(event: 'channelAdded' | 'channelInvited' | 'channelJoined' | 'channelLeft' | 'channelRemoved' | 'channelUpdated', callback: (channel: Channel) => void): this;
  on(event: 'connectionStateChanged', callback: (state: ConnectionState) => void): this;
  on(event: 'memberJoined' | 'memberLeft' | 'memberUpdated', callback: (member: Member) => void): this;
  on(event: 'messageAdded' | 'messageRemoved' | 'messageUpdated' | 'typingEnded' | 'typingStarted', callback: (message: Message) => void): this;
  on(event: 'tokenExpired', callback: () => void): this;
  on(event: 'userInfoUpdated', callback: (userInfo: UserInfo) => void): this;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error' | 'defined';

export interface CreateChannelOptions {
  attributes?: Object;
  isPrivate?: boolean;
  friendlyName?: string;
  uniqueName?: string;
}

export interface Channel extends EventEmitter {
  // properties
  attributes: Object;
  createdBy: string;
  dateCreated: Date;
  dateUpdated: Date;
  friendlyName: string;
  isPrivate: boolean;
  lastConsumedMessageIndex: number;
  members: Map<string, Member>;
  messages: Message[],
  sid: string,
  readonly status: 'known' | 'invited' | 'joined';
  readonly type: 'private' | 'public';
  uniqueName: string;

  // methods
  add(identity: string): Promise<undefined>;
  advanceLastConsumedMessageIndex(index: number): Promise<undefined>;
  decline(): Promise<Channel>;
  delete(): Promise<Channel>;
  getAttributes(): Promise<Object>;
  getMembers(): Promise<Member[]>;
  getMessages(count?: number, anchor?: string): Promise<Message[]>;
  getMessagesPaged(pageSize?: number, anchor?: string): Promise<Paginator<Message>>;
  invite(identity: string): Promise<undefined>;
  join(): Promise<Channel>;
  leave(): Promise<Channel>;
  removeMember(member: Member | string): Promise<Member>;
  sendMessage(messageBody: string, messageAttributes?: Object): Promise<string>;
  setAllMessagesConsumed(): Promise<undefined>;
  setNoMessageConsumed(): void;
  typing(): Promise<undefined>;
  updateAttributes(attributes: Object): Promise<Channel>;
  updateFriendlyName(name: string): Promise<Channel>;
  updateLastConsumedMessageIndex(index: number | null): Promise<undefined>;
  updateUniqueName(uniqueName: string): Promise<undefined>;
  
  // events
  on(event: 'memberInfoUpdated' | 'memberJoined' | 'memberLeft' | 'memberUpdated' | 'typingEnded' | 'typingStarted', callback: (member: Member) => void): this;
  on(event: 'messageAdded' | 'messageRemoved' | 'messageUpdated', callback: (message: Message) => void): this;
  on(event: 'updated', callback: (channel: Channel) => void): this;
}

export interface UserInfo extends EventEmitter {
  // properties
  identity: string;
  friendlyName: string;
  attributes: Object;
  online: boolean;
  notifiable: boolean;

  // methods
  updateAttributes(attributes: Object): Promise<UserInfo>;
  updateFriendlyName(friendlyName: string): Promise<UserInfo>;

  // events
  on(event: 'updated', callback: () => void): this;
} 

export interface Member extends EventEmitter {
  // properties
  channel: Channel;
  identity: string;
  userInfo: UserInfo;
  isTyping: boolean;
  lastConsumedMessageIndex: number;
  lastConsumptionTimestamp: Date;
  sid: string;

  // methods
  remove(): Promise<undefined>;

  // events
  on(event: 'typingEnded' | 'typingStarted' | 'updated' | 'userInfoUpdated', callback: (member: Member) => void): this;
}

export interface Message {
  // properties
  author: string;
  body: string;
  attributes: Object;
  channel: Channel;
  dateUpdated: Date;
  index: number;
  lastUpdatedBy: string;
  sid: string;
  timestamp: Date;

  // methods
  remove(): Promise<Message>;
  updateAttributes(attributes: Object): Promise<Message>;
  updateBody(body: string): Promise<Message>;

  // events
  on(event: 'updated', callback: (message: Message) => void): this;
}

export interface SessionError extends Error {
  code: number;
  message: string;
}

export interface Paginator<T> {
  // properties
  items: Array<T>;
  hasNextPage: boolean;
  hasPrevPage: boolean;

  // methods
  nextPage(): Promise<Paginator<T>>;
  prevPage(): Promise<Paginator<T>>;
}