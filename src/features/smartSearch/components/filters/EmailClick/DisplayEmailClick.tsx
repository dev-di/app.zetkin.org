import { Box, Chip, Tooltip } from '@mui/material';

import DisplayTimeFrame from '../DisplayTimeFrame';
import { getTimeFrameWithConfig } from '../../utils';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import useEmails from 'features/emails/hooks/useEmails';
import { useNumericRouteParams } from 'core/hooks';
import {
  EmailClickFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';
import { LINK_TYPE_SELECT, LIST_SELECT } from '.';

const localMessageIds = messageIds.filters.emailClick;

interface DisplayEmailClickProps {
  filter: SmartSearchFilterWithId<EmailClickFilterConfig>;
}

const DisplayEmailClick = ({ filter }: DisplayEmailClickProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const emails = useEmails(orgId).data || [];
  const projects = useCampaigns(orgId).data || [];

  const { config } = filter;
  const { operator, campaign: projectId, email: emailId, links } = config;

  const op = filter.op || OPERATION.ADD;
  const emailTitle = emails?.find((item) => item.id === emailId)?.title;
  const projectTitle = projects?.find((item) => item.id === projectId)?.title;

  const timeFrame = getTimeFrameWithConfig({
    after: config.after,
    before: config.before,
  });

  const fakeLinkList = [
    { id: 1, url: 'http://www.hellomyexample.com/veryLong/long/long/long/url' },
    { id: 2, url: 'http://world.com' },
  ];

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        clickSelect: (
          <UnderlinedMsg
            id={
              localMessageIds.clickSelect[
                operator === 'clicked' ? 'clicked' : 'notClicked'
              ]
            }
          />
        ),
        emailSelect: (
          <>
            {''}
            {emailId && <UnderlinedText text={`"${emailTitle}"`} />}
          </>
        ),
        linkSelect: (
          <>
            {''}
            {links && (
              <Box alignItems="start" display="inline-flex">
                :{' '}
                {fakeLinkList
                  .filter((item) => filter.config.links?.includes(item.id))
                  .map((link) => {
                    return (
                      <Tooltip title={link.url}>
                        <Chip
                          key={link.id}
                          label={link.url.split('://')[1]}
                          size="small"
                          sx={{
                            margin: '3px',
                            maxWidth: '200px',
                            textOverflow: 'ellipsis',
                          }}
                          variant="outlined"
                        />
                      </Tooltip>
                    );
                  })}
              </Box>
            )}
          </>
        ),
        linkTypeSelect: (
          <UnderlinedMsg
            id={
              localMessageIds.linkSelect[
                filter.config.links
                  ? LINK_TYPE_SELECT.FOLLOWING_LINKS
                  : LINK_TYPE_SELECT.ANY_LINK
              ]
            }
          />
        ),
        listSelect: (
          <UnderlinedMsg
            id={
              messageIds.filters.emailListSelect[
                filter.config.campaign
                  ? LIST_SELECT.FROM_PROJECT
                  : filter.config.email
                  ? LIST_SELECT.SPECIFIC_EMAIL
                  : LIST_SELECT.ANY
              ]
            }
          />
        ),
        projectSelect: (
          <>
            {''}
            {projectId && <UnderlinedText text={`"${projectTitle}"`} />}
          </>
        ),
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplayEmailClick;
