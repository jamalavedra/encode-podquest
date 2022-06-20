import { HashtagMatcher } from '@/utils/matchers/HashtagMatcher'
import { MDBoldMatcher } from '@/utils/matchers/markdown/MDBoldMatcher'
import { MDCodeMatcher } from '@/utils/matchers/markdown/MDCodeMatcher'
import { MDQuoteMatcher } from '@/utils/matchers/markdown/MDQuoteMatcher'
import { MDStrikeMatcher } from '@/utils/matchers/markdown/MDStrikeMatcher'
import { MentionMatcher } from '@/utils/matchers/MentionMatcher'
import { SpoilerMatcher } from '@/utils/matchers/SpoilerMatcher'
import trimify from '@/lib/trimify'
import { Interweave } from 'interweave'
import { UrlMatcher } from 'interweave-autolink'
import React, { FC } from 'react'

interface Props {
	children: string
}

const Markup: FC<Props> = ({ children }) => {
	return (
		<Interweave
			content={trimify(children)}
			escapeHtml
			allowList={['b', 'i', 'a', 'br', 'code', 'span']}
			newWindow
			matchers={[
				new HashtagMatcher('hashtag'),
				new MentionMatcher('mention'),
				new MDBoldMatcher('mdBold'),
				// new MDItalicMatcher('mdItalic'),
				new MDStrikeMatcher('mdStrike'),
				new MDQuoteMatcher('mdQuote'),
				new MDCodeMatcher('mdCode'),
				new SpoilerMatcher('spoiler'),
				new UrlMatcher('url', { validateTLD: false }),
			]}
		/>
	)
}

export default Markup
