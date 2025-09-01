import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized, ActivationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';

@Component({
	template: ''
})
export abstract class PageBaseClass implements OnInit, OnDestroy {
	router: Router;
	route: ActivatedRoute;
	routeParams: any;
	routeData: any;
	paramsSubscription: Subscription;
	dataSubscription: Subscription;
	eventSubscription: Subscription;
	routerUrlSubscription: Subscription;

	constructor(protected injector: Injector) {
		this.injectDependencies();
	}

	/**
	 * setParentRouteInfo must come before interceptRouteChanges
	 * because we might use parentRouteParams on route params change
	 */
	ngOnInit(): void {
		this.interceptRouteChanges();
	}

	private injectDependencies(): void {
		this.router = this.injector.get(Router);
		this.route = this.injector.get(ActivatedRoute);
	}

	private interceptRouteChanges(): void {
		this.eventSubscription = this.router.events.subscribe(routerEvents => {
			if (routerEvents instanceof ActivationStart) {
				this.onRouterEventsStart(routerEvents);
			}
			//TODO: add as many router events intances as you want
		});
		this.routerUrlSubscription = this.router.events.pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise()).subscribe((events: RoutesRecognized[]) => {
			//TODO: implement logic in case you want to track URL changes
		});
		this.paramsSubscription = this.route.params.subscribe(routeParams => {
			this.routeParams = routeParams;
			this.onRouteParamsChange(routeParams);
		});
		this.dataSubscription = this.route.data.subscribe(routeData => {
			this.routeData = routeData;
			this.onRouteDataChange(routeData);
		});
	}

	public onRouterEventsStart(routerEvent: any): void { }

	public onRouteParamsChange(params: any): void {}

	public onRouteDataChange(data: any): void {}

	ngOnDestroy(): void {
		if (this.paramsSubscription) { this.paramsSubscription.unsubscribe(); }
		if (this.dataSubscription) { this.dataSubscription.unsubscribe(); }
		if (this.eventSubscription) { this.eventSubscription.unsubscribe(); }
		if (this.routerUrlSubscription) { this.routerUrlSubscription.unsubscribe(); }
	}
}

