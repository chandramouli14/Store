/* eslint-disable no-underscore-dangle */
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ScrollSpyDirective } from './scroll-spy.directive';

fdescribe('scrollSpy directive ([moneyMovementScrollSpy])', () => {
  @Component({
    selector: 'moneyMovement-test-component',
    template: `<div>
      <div class="profile-menu">
        <svg class="random-decoration"></svg>
        <a href="#favorites">favorites</a>
        <hr />
        <a href="#section-a">a</a>
        <a href="#section-b">b</a>
        <a href="#section-c">c</a>
      </div>
      <div
        moneyMovementScrollSpy
        [menuTarget]="menuTarget"
        [spiedTags]="['DIV']"
        (sectionChange)="onSectionChange($event)"
      >
        <div id="favorites">Favorites are here</div>
        <hr />
        <div id="section-a">A</div>
        <div id="section-b">B</div>
        <div id="section-c">C</div>
      </div>
    </div>`,
  })
  class TestComponent {
    @Input() menuTarget = '';
    // eslint-disable-next-line class-methods-use-this
    onSectionChange() {}
  }

  const renderDirectiveTest = async (
    props: Partial<TestComponent>,
    section: string = ''
  ) => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ScrollSpyDirective, TestComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of(section),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    Object.assign(fixture.componentInstance, props || {});
    fixture.detectChanges();

    const menuEl = fixture.debugElement.query(By.directive(ScrollSpyDirective));
    const directive = menuEl.injector.get(ScrollSpyDirective);
    directive.section = section;

    // note: when rendering, we mock the content passed in template
    // because there is a very niche case with Angular Testing of
    // ElementRef injected into Directive (unfortunately),
    // so this is mocking what would be the markup of the directive
    // attached element represented above

    directive.getElement = spyOn(directive, 'getElement').and.returnValue({
      nativeElement: {
        children: [
          {
            children: [
              { id: 'random-decoration', offsetTop: 0, tagName: 'SVG' },
              { id: 'favorites', offsetTop: 0, tagName: 'DIV' },
              { id: 'linebreak', offsetTop: 32, tagName: 'HR' },
              { id: 'section-a', offsetTop: 32, tagName: 'DIV' },
              { id: 'section-b', offsetTop: 48, tagName: 'DIV' },
              { id: 'section-c', offsetTop: 64, tagName: 'DIV' },
            ],
          },
        ],
      },
    });

    return directive;
  };

  it('renders with no issues', async () => {
    await renderDirectiveTest({ menuTarget: '.profile-menu' });
  });

  it('populates menu targets after view initializes and sets spiedTagSet', async () => {
    const directive = await renderDirectiveTest({
      menuTarget: '.profile-menu',
    });
    expect(directive.menuTargetMap.size).toEqual(0);
    expect(directive.spiedTagSet.size).toEqual(1);
  });

  it('populates menu targets after view initializes and sets spiedTagSet with an initial fragment determining section', async () => {
    const directive = await renderDirectiveTest(
      { menuTarget: '.profile-menu' },
      'section-b'
    );

    expect(directive.section).toEqual('section-b');
  });

  it('onSectionChange will update section and emits an event for the section when necessary', async () => {
    const directive = await renderDirectiveTest(
      {
        menuTarget: '.profile-menu',
      },
      'section-a'
    );

    // spyOn(directive, 'getElement').and.returnValue({
    //   nativeElement: {
    //     children: [
    //       {
    //         children: [
    //           { id: 'random-decoration', offsetTop: 0, tagName: 'SVG' },
    //           { id: 'favorites', offsetTop: 0, tagName: 'DIV' },
    //           { id: 'linebreak', offsetTop: 32, tagName: 'HR' },
    //           { id: 'section-a', offsetTop: 32, tagName: 'DIV' },
    //           { id: 'section-b', offsetTop: 48, tagName: 'DIV' },
    //           { id: 'section-c', offsetTop: 64, tagName: 'DIV' },
    //         ],
    //       },
    //     ],
    //   },
    // });
    const nextSection = 'section-a';
    directive.onSectionChange(nextSection);
    expect(directive.section).toEqual(nextSection);
  });

  it('will start in first section and not emit a change event if on the same section highlighted for onScroll', async () => {
    const directive = await renderDirectiveTest(
      {
        menuTarget: '.profile-menu',
      },
      'favorites'
    );

    const onSectionChangeSpy = spyOn(directive.sectionChange, 'emit');

    const event = {
      target: { scrollTop: 0, scrollHeight: 0, containerHeight: 0 },
    } as unknown as Event;

    directive.onScroll(event);

    expect(onSectionChangeSpy).not.toHaveBeenCalled();
    expect(directive.section).toEqual('favorites');
  });

  it('onScroll will update the section and emits an event for a changed section when necessary', async () => {
    const directive = await renderDirectiveTest({
      menuTarget: '.profile-menu',
    });

    const onSectionChangeSpy = spyOn(directive.sectionChange, 'emit');

    const event = {
      target: { scrollTop: 0, scrollHeight: 0, containerHeight: 0 },
    } as unknown as Event;

    directive.section = 'non-selected-section';
    directive.onScroll(event);

    expect(onSectionChangeSpy).toHaveBeenCalledWith('favorites');
    expect(directive.section).toEqual('non-selected-section');
  });

  it('onScroll will dispatch the last element in view if scrolled beyond a minimum threshhold', async () => {
    const directive = await renderDirectiveTest(
      {
        menuTarget: '.profile-menu',
      },
      'section-c'
    );

    const onSectionChangeSpy = spyOn(directive.sectionChange, 'emit');

    const event = {
      target: {
        scrollTop: 1000,
        scrollHeight: 128,
        containerHeight: 16,
        offsetTop: 0,
      },
    } as unknown as Event;

    directive.onScroll(event);
    expect(onSectionChangeSpy).not.toHaveBeenCalledWith('section-c');
    expect(directive.section).toEqual('section-c');
  });
});
