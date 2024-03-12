import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, fromEvent } from 'rxjs';

@Directive({
  selector: '[moneyMovementScrollSpy]',
})
export class ScrollSpyDirective implements AfterViewInit {
  hasInitialized = false;
  hasScrollHighlighting = true;

  lastScrollEndedAt = new Date();
  spiedTagSet = new Set<string>();
  section = '';
  menuTargetEl: Element | null = null;
  menuTargetMap = new Map<string, Element>();

  @Input() set spiedTags(tags: string[]) {
    this.spiedTagSet = new Set(tags);
  }
  @Input() isManual = false;

  /**
   * document selector for menu in overall DOM
   * to mimick scroll-spy bootstrap behavior;
   * note that for performance and complexity reasons
   * the menu element only is queried after initial
   * view init in this implementation
   */
  @Input() menuTarget = '';

  @Output() public sectionChange = new EventEmitter<string>();

  constructor(
    public el: ElementRef,
    public route: ActivatedRoute,
    private renderer: Renderer2
  ) {}

  /** written for ease of mocking/testing directive injection of ElementRef issues  */
  getElement() {
    return this.el;
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    if (!this.hasScrollHighlighting) {
      return;
    }
    if (this.isManual) {
      return;
    }

    const el = this.getElement();
    const scrollEl = event.target as HTMLElement;
    let section = '';
    const { children } = el.nativeElement.children[0];
    const { scrollTop, scrollHeight, clientHeight: containerHeight } = scrollEl;

    let firstRelevantIndex = 0;
    let lastRelevantIndex = children.length - 1;

    while (
      this.spiedTagSet.size &&
      !this.spiedTagSet.has(children[firstRelevantIndex].tagName)
    ) {
      firstRelevantIndex += 1;
    }
    while (
      this.spiedTagSet.size &&
      !this.spiedTagSet.has(children[lastRelevantIndex].tagName)
    ) {
      lastRelevantIndex -= 1;
    }

    // first item when scrolled to beginning
    if (Math.ceil(scrollTop) <= 24) {
      section = children[firstRelevantIndex].id;
      this.onSectionChange(section);
      return;
    }

    // last item when scrolled to end

    if (Math.ceil(scrollHeight - scrollTop) - containerHeight <= 24) {
      section = children[lastRelevantIndex].id;
      this.onSectionChange(section);
      return;
    }

    // iterate through children from last to first, and find the last
    // within viewable bounds at top

    let i = children.length - 1;
    while (i > 0) {
      const { tagName, offsetTop, id } = children[i];
      const isTarget = !this.spiedTagSet.size || this.spiedTagSet.has(tagName);

      if (!isTarget) {
        i -= 1;
        continue;
      }

      // note: 24 px is for padding offset/threshold. Did not want
      // to introduce complexity by using element rect/needing to debounce
      // for perf in initial implementation

      if (offsetTop - scrollEl.offsetTop - 24 <= scrollTop) {
        section = id;
        break;
      }

      i -= 1;
    }

    this.onSectionChange(section);
  }

  onSectionChange(section: string) {
    if (section === this.section) {
      return;
    }
    this.sectionChange.emit(section);
    const prevActiveEl = this.menuTargetMap.get(this.section);
    const activeEl = this.menuTargetMap.get(section);

    if (prevActiveEl && activeEl) {
      this.renderer.removeClass(prevActiveEl, 'active');
    }

    if (activeEl) {
      this.renderer.addClass(activeEl, 'active');

      // timeout set for browser issue with element state + scroll event;
      // 250ms is a delay set by Chrome for scroll events

      setTimeout(() => {
        activeEl.scrollIntoView({
          block: 'end',
          inline: 'nearest',
        });
      }, 250);
    }

    if (this.menuTargetMap.has(section)) {
      this.section = section;
      this.sectionChange.emit(this.section);
    }
  }

  ngAfterViewInit() {
    if (this.menuTarget) {
      this.menuTargetEl = document.querySelector(this.menuTarget);
      this.menuTargetMap.clear();

      const children = Array.from(this.menuTargetEl?.children || []);

      let firstRelevantIndex = -1;
      children.forEach((el: Element, i) => {
        if (!el.hasAttribute('name')) {
          return;
        }

        if (firstRelevantIndex === -1) {
          firstRelevantIndex = i;
        }

        const targetId = (el.getAttribute('name') || '').substring(1);
        this.menuTargetMap.set(targetId || '', el);
      });

      this.onLoadSetting();
    }
  }

  onLoadSetting() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment === null) {
        if (!this.hasInitialized) {
          this.onSectionChange([...this.menuTargetMap.keys()][0]);
        }

        this.hasInitialized = true;
        return;
      }

      if (this.menuTargetMap.has(fragment)) {
        this.hasScrollHighlighting = false;
        this.onSectionChange(fragment);
      }

      if (!this.hasInitialized) {
        this.hasScrollHighlighting = true;
        this.hasInitialized = true;
      }
    });

    fromEvent(this.el.nativeElement, 'scroll')
      .pipe(debounceTime(350))
      .subscribe(() => {
        this.hasScrollHighlighting = true;
      });
  }
}
