import { useState, memo, useCallback, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import { ReactComponent as ArrowLeftIcon } from 'icons/arrow-left.svg';

interface DropdownProps {
  on: boolean;
  playbackRates: number[];
  resolutions: shaka.extern.TrackList;
  activePlaybackRate: number;
  activeResolutionHeight: number | 'auto';
  onClose: (on: boolean) => void;
  onChangePlaybackRate: (playbackRate: number) => void;
  onChangeResolution: (resolution: shaka.extern.Track | 'auto') => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  on,
  playbackRates,
  resolutions,
  activePlaybackRate,
  activeResolutionHeight,
  onClose,
  onChangePlaybackRate,
  onChangeResolution,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isIndex, setIsIndex] = useState(true);
  const [activeType, setActiveType] = useState<'speed' | 'resolution'>('speed');
  const [dropdownHeight, setDropdownHeight] = useState<'initial' | number>(
    'initial'
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMounted) return;

    const outsideClickHandler = (event: MouseEvent) => {
      if (!isMounted || !dropdownRef || !dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        onClose(false);
      }
    };

    document.addEventListener('click', outsideClickHandler);

    return () => {
      document.removeEventListener('click', outsideClickHandler);
    };
  }, [isMounted, onClose]);

  useEffect(() => {
    if (!on) return;

    const dropdown = dropdownRef.current!;
    const dropdownMenu = dropdown.firstChild as HTMLElement;

    setDropdownHeight(dropdownMenu?.offsetHeight || 'initial');
  }, [on]);

  const dropdownEnteredHandler = useCallback(() => {
    setIsMounted(true);
  }, []);

  const dropdownExitedHandler = useCallback(() => {
    setIsMounted(false);
    setIsIndex(true);
    setDropdownHeight('initial');
  }, []);

  const calcHeight = useCallback((element: HTMLElement) => {
    setDropdownHeight(element.offsetHeight);
  }, []);

  const selectMenuHandler = useCallback((type: 'speed' | 'resolution') => {
    return () => {
      setIsIndex(false);
      setActiveType(type);
    };
  }, []);

  const selectPlaybackRateHandler = useCallback(
    (playbackRate: number) => {
      return () => {
        setIsIndex(true);
        onChangePlaybackRate(playbackRate);
      };
    },
    [onChangePlaybackRate]
  );

  const selectResolutionHandler = useCallback(
    (resolution: shaka.extern.Track | 'auto') => {
      return () => {
        setIsIndex(true);
        onChangeResolution(resolution);
      };
    },
    [onChangeResolution]
  );

  const matchedResolution = resolutions.find(
    (resolution) => resolution.height === activeResolutionHeight
  );
  const autoResolutionHeight = resolutions.find(
    (resolution) => resolution.active
  )?.height;

  const indexMenu = (
    <div className="vp-dropdown__menu">
      <ul className="vp-dropdown__list">
        <li className="vp-dropdown__item" onClick={selectMenuHandler('speed')}>
          <span>Speed</span>
          <span>x {activePlaybackRate}</span>
        </li>
        {resolutions.length > 0 && (
          <li
            className="vp-dropdown__item"
            onClick={selectMenuHandler('resolution')}
          >
            <span>Resolution</span>
            <span>
              {activeResolutionHeight === 'auto' || !matchedResolution
                ? `Auto (${autoResolutionHeight}p)`
                : `${activeResolutionHeight}p`}
            </span>
          </li>
        )}
      </ul>
    </div>
  );

  const playbackList = (
    <ul className="vp-dropdown__list">
      {playbackRates.map((playbackRate) => (
        <li
          key={playbackRate}
          className={`vp-dropdown__item${
            activePlaybackRate === playbackRate ? ' active' : ''
          }`}
          onClick={selectPlaybackRateHandler(playbackRate)}
        >
          {playbackRate}
        </li>
      ))}
    </ul>
  );

  const resolutionList = (
    <ul className="vp-dropdown__list">
      {resolutions.map((resolution) => (
        <li
          key={resolution.id}
          className={`vp-dropdown__item${
            activeResolutionHeight === resolution.height ? ' active' : ''
          }`}
          onClick={selectResolutionHandler(resolution)}
        >
          {resolution.height}p
        </li>
      ))}
      <li
        className={`vp-dropdown__item${
          activeResolutionHeight === 'auto' ? ' active' : ''
        }`}
        onClick={selectResolutionHandler('auto')}
      >
        <span>Auto</span>
      </li>
    </ul>
  );

  const mainMenu = (
    <div className="vp-dropdown__menu">
      <div className="vp-dropdown__label" onClick={() => setIsIndex(true)}>
        <ArrowLeftIcon />
        <span>
          {activeType === 'speed' && 'Speed'}
          {activeType === 'resolution' && 'Resolution'}
        </span>
      </div>
      <ul className="vp-dropdown__list">
        {activeType === 'speed' && playbackList}
        {activeType === 'resolution' && resolutionList}
      </ul>
    </div>
  );

  return (
    <CSSTransition
      in={on}
      classNames="vp-dropdown"
      timeout={200}
      mountOnEnter
      unmountOnExit
      onEntered={dropdownEnteredHandler}
      onExited={dropdownExitedHandler}
    >
      <div
        className="vp-dropdown"
        ref={dropdownRef}
        style={{ height: dropdownHeight }}
      >
        <CSSTransition
          in={isIndex}
          classNames="vp-menu-index"
          timeout={300}
          mountOnEnter
          unmountOnExit
          onEnter={calcHeight}
        >
          {indexMenu}
        </CSSTransition>

        <CSSTransition
          in={!isIndex}
          classNames="vp-menu-main"
          timeout={300}
          mountOnEnter
          unmountOnExit
          onEnter={calcHeight}
        >
          {mainMenu}
        </CSSTransition>
      </div>
    </CSSTransition>
  );
};

export default memo(Dropdown);
