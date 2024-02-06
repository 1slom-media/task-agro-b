import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Events } from './types';

@Resolver()
export class EventsResolver {
  constructor(private readonly eventService: EventsService) {}

  @Query(() => [Events])
  async getAllEvent() {
    return this.eventService.findAll();
  }

  @Query(() => Events, { nullable: true })
  async getEventById(@Args('id', { type: () => Int }) id: number) {
    return this.eventService.findById(id);
  }

  @Query(() => [Events])
  async filterEvents(
    @Args('subcategoryId', { nullable: true, type: () => Int })
    subcategoryId: number,
    @Args('day', { nullable: true }) day: string,
    @Args('eventType', { nullable: true }) eventType: string,
    @Args('fullname', { nullable: true }) fullname: string,
  ) {
    return this.eventService.filterEvents(
      subcategoryId,
      day,
      eventType,
      fullname,
    );
  }
}
