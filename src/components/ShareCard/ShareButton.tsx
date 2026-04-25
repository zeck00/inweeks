import { useRef, useState, useCallback } from 'react';
import { toBlob } from 'html-to-image';
import { Download, Share2, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useWeekCalculations } from '../../hooks/useWeekCalculations';
import { countries } from '../../data/life-expectancy';
import { Button } from '../common/Button/Button';
import { ShareCard, CARD_W, CARD_H } from './ShareCard';

export function ShareButton() {
  const { state } = useApp();
  const [status, setStatus] = useState<'idle' | 'generating' | 'done'>('idle');
  const [renderCard, setRenderCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { stats } = useWeekCalculations(
    state.profile?.birthday ?? null,
    state.profile?.lifeExpectancy ?? null,
    state.chapters
  );

  const countryName = countries.find(c => c.code === state.profile?.countryCode)?.name ?? '';

  const generate = useCallback(async () => {
    if (!stats) return;

    setStatus('generating');

    // Render the card now
    setRenderCard(true);

    // Wait for it to actually mount
    await new Promise(r => requestAnimationFrame(() => r(null)));
    await new Promise(r => requestAnimationFrame(() => r(null)));

    const cardEl = cardRef.current;
    if (!cardEl) {
      setStatus('idle');
      setRenderCard(false);
      return;
    }

    try {
      await document.fonts.ready;

      const wrapper = cardEl.parentElement;
      if (wrapper) {
        wrapper.style.width = `${CARD_W}px`;
        wrapper.style.height = `${CARD_H}px`;
        wrapper.style.opacity = '1';
        wrapper.style.position = 'fixed';
        wrapper.style.left = '-9999px';
        wrapper.style.top = '0';
      }

      // Small delay for layout
      await new Promise(r => setTimeout(r, 50));

      const isDark = state.darkMode;
      const blob = await toBlob(cardEl, {
        width: CARD_W,
        height: CARD_H,
        pixelRatio: 2,
        backgroundColor: isDark ? '#0A0A0C' : '#FAFAFA',
      });

      // Tear down DOM
      setRenderCard(false);

      if (!blob) {
        setStatus('idle');
        return;
      }

      // Try native share
      if (typeof navigator.share === 'function' && navigator.canShare) {
        try {
          const file = new File([blob], 'inweeks.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'My Life, In Weeks',
              files: [file],
            });
            setStatus('done');
            setTimeout(() => setStatus('idle'), 2000);
            return;
          }
        } catch {
          // Fall through
        }
      }

      // Fallback: download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'inweeks.png';
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setStatus('done');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error('Share card generation failed:', err);
      setStatus('idle');
      setRenderCard(false);
    }
  }, [stats, state.darkMode]);

  if (!stats || !state.profile) return null;

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={generate}
        loading={status === 'generating'}
        icon={
          status === 'done' ? <Check size={16} /> :
          typeof navigator.share === 'function' ? <Share2 size={16} /> :
          <Download size={16} />
        }
      >
        {status === 'done' ? 'Saved' : status === 'generating' ? 'Generating...' : 'Share'}
      </Button>

      {renderCard && (
        <ShareCard
          ref={cardRef}
          stats={stats}
          chapters={state.chapters}
          birthday={state.profile.birthday}
          countryName={countryName}
          darkMode={state.darkMode}
        />
      )}
    </>
  );
}
